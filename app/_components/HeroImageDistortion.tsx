"use client";

import { useEffect, useRef, useState } from "react";

interface HeroImageDistortionProps {
  imageUrl: string;
  alt: string;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uRadius;
uniform float uStrength;
uniform vec2 uCoverScale;
varying vec2 vUv;

void main() {
  float dist = distance(vUv, uMouse);
  float influence = smoothstep(uRadius, 0.0, dist);
  vec2 screenUv = vUv - uVelocity * influence * uStrength;
  vec2 texUv = (screenUv - 0.5) / uCoverScale + 0.5;

  if (texUv.x < 0.0 || texUv.x > 1.0 || texUv.y < 0.0 || texUv.y > 1.0) {
    gl_FragColor = vec4(0.04, 0.04, 0.04, 1.0);
  } else {
    gl_FragColor = texture2D(uTexture, texUv);
  }
}
`;

function shouldUseDistortion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    return false;
  }

  return true;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

function loadTexture(
  gl: WebGLRenderingContext,
  imageUrl: string
): Promise<{ texture: WebGLTexture; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const image = new Image();
    const isExternal = /^https?:\/\//i.test(imageUrl);

    if (isExternal) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      const texture = gl.createTexture();
      if (!texture) {
        resolve(null);
        return;
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      resolve({
        texture,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => resolve(null);
    image.src = imageUrl;
  });
}

export default function HeroImageDistortion({
  imageUrl,
  alt,
}: HeroImageDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useStaticImage, setUseStaticImage] = useState(true);
  const [isTextureReady, setIsTextureReady] = useState(false);

  useEffect(() => {
    setUseStaticImage(!shouldUseDistortion());
  }, []);

  useEffect(() => {
    if (useStaticImage) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      setUseStaticImage(true);
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) {
      setUseStaticImage(true);
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const mouseLocation = gl.getUniformLocation(program, "uMouse");
    const velocityLocation = gl.getUniformLocation(program, "uVelocity");
    const radiusLocation = gl.getUniformLocation(program, "uRadius");
    const strengthLocation = gl.getUniformLocation(program, "uStrength");
    const coverScaleLocation = gl.getUniformLocation(program, "uCoverScale");
    const textureLocation = gl.getUniformLocation(program, "uTexture");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let animationFrame = 0;
    let textureInfo: { texture: WebGLTexture; width: number; height: number } | null =
      null;
    let disposed = false;

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    const velocity = { x: 0, y: 0 };
    const coverScale = { x: 1, y: 1 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (textureInfo) {
        const containerAspect = width / height;
        const imageAspect = textureInfo.width / textureInfo.height;

        if (imageAspect > containerAspect) {
          coverScale.x = imageAspect / containerAspect;
          coverScale.y = 1;
        } else {
          coverScale.x = 1;
          coverScale.y = containerAspect / imageAspect;
        }
      }
    };

    const render = () => {
      if (!textureInfo) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      mouse.x += (targetMouse.x - mouse.x) * 0.12;
      mouse.y += (targetMouse.y - mouse.y) * 0.12;
      velocity.x *= 0.9;
      velocity.y *= 0.9;

      gl.clearColor(0.04, 0.04, 0.04, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.uniform1i(textureLocation, 0);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      gl.uniform2f(velocityLocation, velocity.x, velocity.y);
      gl.uniform1f(radiusLocation, 0.22);
      gl.uniform1f(strengthLocation, 0.035);
      gl.uniform2f(coverScaleLocation, coverScale.x, coverScale.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / rect.width;
      const nextY = 1 - (event.clientY - rect.top) / rect.height;

      velocity.x += (nextX - targetMouse.x) * 0.65;
      velocity.y += (nextY - targetMouse.y) * 0.65;

      targetMouse.x = Math.min(1, Math.max(0, nextX));
      targetMouse.y = Math.min(1, Math.max(0, nextY));
    };

    const handlePointerLeave = () => {
      velocity.x *= 0.35;
      velocity.y *= 0.35;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        velocity.x = 0;
        velocity.y = 0;
      }
    };

    void loadTexture(gl, imageUrl).then((result) => {
      if (disposed) {
        return;
      }

      if (!result) {
        setUseStaticImage(true);
        return;
      }

      textureInfo = result;
      setIsTextureReady(true);
      resize();
      render();
    });

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);

      if (textureInfo?.texture) {
        gl.deleteTexture(textureInfo.texture);
      }

      if (buffer) {
        gl.deleteBuffer(buffer);
      }

      gl.deleteProgram(program);
    };
  }, [imageUrl, useStaticImage]);

  return (
    <>
      {/* Plain img is required for WebGL texture loading and reduced-motion fallback. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover object-center ${
          !useStaticImage && isTextureReady ? "sr-only" : ""
        }`}
        fetchPriority="high"
      />
      {!useStaticImage ? (
        <canvas
          ref={canvasRef}
          aria-label={isTextureReady ? alt : undefined}
          aria-hidden={!isTextureReady}
          role="img"
          className={`absolute inset-0 h-full w-full ${
            isTextureReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </>
  );
}
