"use client";

import { useEffect, useRef, useState } from "react";
import HeroDistortionTuner from "./HeroDistortionTuner";
import {
  DEFAULT_HERO_DISTORTION_CONFIG,
  loadHeroDistortionConfig,
  MAX_RIPPLE_DROPS,
  createRippleDrop,
  type HeroDistortionConfig,
  type RippleDrop,
} from "./hero-distortion-config";

interface HeroImageDistortionProps {
  imageUrl: string;
  alt: string;
}

const IS_DEV = process.env.NODE_ENV === "development";

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

#define MAX_RIPPLES ${MAX_RIPPLE_DROPS}

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;
uniform int uRippleCount;
uniform vec4 uRipples[MAX_RIPPLES];
uniform vec4 uRippleMeta[MAX_RIPPLES];
uniform float uWaveNumber;
uniform float uOmega;
uniform float uRippleLife;
uniform float uFalloffScale;
uniform float uDecayRate;
uniform float uFrontSpeed;
uniform float uFrontWidth;
uniform float uRefraction;
uniform float uAmbientStrength;
uniform float uWakeAngle;
uniform float uWakeSpeedBoost;
uniform vec2 uCoverScale;
uniform vec2 uTexel;
varying vec2 vUv;

float ambientHeight(vec2 uv, float t) {
  float h = 0.0;
  h += sin(uv.x * 3.1 + uv.y * 2.3 + t * 0.30);
  h += sin(uv.x * 2.7 - uv.y * 3.7 + t * 0.23 + 1.7);
  h += sin((uv.x + uv.y) * 4.1 - t * 0.19 + 0.9);
  return h * (1.0 / 3.0);
}

float pebbleHeight(vec2 uv, vec4 ripple, float aspect, float now) {
  float age = now - ripple.z;
  if (age <= 0.0 || age > uRippleLife) {
    return 0.0;
  }

  vec2 d = vec2((uv.x - ripple.x) * aspect, uv.y - ripple.y);
  float r = length(d);
  float decay = exp(-age * uDecayRate);
  float lifeT = age / uRippleLife;
  float lifeFade = pow(max(1.0 - lifeT, 0.0), 0.85);

  float ringSpacing = 6.28318530718 / uWaveNumber;
  float front = uFrontSpeed * age;
  float wave = sin(r * uWaveNumber - age * uOmega);

  float e0 = exp(-pow((r - front) / uFrontWidth, 2.0));
  float e1 = exp(-pow((r - max(front - ringSpacing, 0.0)) / uFrontWidth, 2.0)) * 0.72;
  float e2 = exp(-pow((r - max(front - ringSpacing * 2.0, 0.0)) / uFrontWidth, 2.0)) * 0.48;
  float e3 = exp(-pow((r - max(front - ringSpacing * 3.0, 0.0)) / uFrontWidth, 2.0)) * 0.28;
  float envelope = e0 + e1 + e2 + e3;

  float reached = 1.0 - smoothstep(front - uFrontWidth * 0.35, front + uFrontWidth * 1.2, r);
  float falloff = 1.0 / (1.0 + r * uFalloffScale * 0.45);

  return wave * envelope * reached * falloff * decay * lifeFade * ripple.w;
}

float wakeHeight(vec2 uv, vec4 ripple, vec4 meta, float aspect, float now) {
  float age = now - ripple.z;
  if (age <= 0.0 || age > uRippleLife) {
    return 0.0;
  }

  vec2 dir = meta.xy;
  float dirLen = length(dir);
  if (dirLen < 0.001) {
    return 0.0;
  }
  dir /= dirLen;

  vec2 d = vec2((uv.x - ripple.x) * aspect, uv.y - ripple.y);
  vec2 travelDir = normalize(vec2(dir.x * aspect, dir.y));
  vec2 perpDir = vec2(-travelDir.y, travelDir.x);

  float along = dot(d, travelDir);
  float across = dot(d, perpDir);
  float behind = max(-along, 0.0);

  float aheadMask = 1.0 - smoothstep(-0.015, 0.05, along);
  if (aheadMask < 0.01 || behind < 0.001) {
    return 0.0;
  }

  float decay = exp(-age * uDecayRate);
  float lifeT = age / uRippleLife;
  float lifeFade = pow(max(1.0 - lifeT, 0.0), 0.85);
  float speedBoost = 1.0 + meta.z * uWakeSpeedBoost;

  float armLine = abs(across) - uWakeAngle * behind;
  float leftArm = exp(-pow(armLine / uFrontWidth, 2.0));
  float chevron = exp(-pow(across / (behind * uWakeAngle + 0.03), 2.0)) * 0.32;

  float transverse = sin(across * uWaveNumber - age * uOmega);
  float divergent = sin((behind * 0.65 + abs(across) * 0.4) * uWaveNumber - age * uOmega);
  float wave = mix(transverse, divergent, 0.38);

  float envelope = max(leftArm, chevron);
  float maxBehind = uFrontSpeed * age * speedBoost * 1.15;
  float extent = smoothstep(maxBehind + 0.18, maxBehind * 0.25, behind);
  float falloff = 1.0 / (1.0 + behind * uFalloffScale * 0.42);

  return wave * envelope * aheadMask * extent * falloff * decay * lifeFade * ripple.w;
}

float rippleHeight(vec2 uv, vec4 ripple, vec4 meta, float aspect, float now) {
  if (meta.w < 0.5) {
    return pebbleHeight(uv, ripple, aspect, now);
  }
  return wakeHeight(uv, ripple, meta, aspect, now);
}

float heightField(vec2 uv, float now) {
  float h = uAmbientStrength * ambientHeight(uv, now);

  for (int i = 0; i < MAX_RIPPLES; i++) {
    if (i >= uRippleCount) {
      break;
    }
    h += rippleHeight(uv, uRipples[i], uRippleMeta[i], uAspect, now);
  }

  return h;
}

vec2 toTexUv(vec2 screenUv) {
  return (screenUv - 0.5) / uCoverScale + 0.5;
}

vec4 sampleCover(vec2 screenUv) {
  vec2 texUv = toTexUv(screenUv);
  if (texUv.x < 0.0 || texUv.x > 1.0 || texUv.y < 0.0 || texUv.y > 1.0) {
    return vec4(0.04, 0.04, 0.04, 1.0);
  }
  return texture2D(uTexture, texUv);
}

void main() {
  vec2 uv = vUv;
  float h = heightField(uv, uTime);
  float hx = heightField(uv + vec2(uTexel.x, 0.0), uTime);
  float hy = heightField(uv + vec2(0.0, uTexel.y), uTime);
  vec2 tilt = vec2(h - hx, h - hy);

  vec2 refractedUv = clamp(uv + tilt * uRefraction, 0.0, 1.0);
  gl_FragColor = sampleCover(refractedUv);
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

function pruneRipples(ripples: RippleDrop[], now: number, life: number): RippleDrop[] {
  return ripples.filter((ripple) => now - ripple.birthTime <= life);
}

function trimRipplePool(
  ripples: RippleDrop[],
  elapsed: number,
  maxCount: number,
  life: number
): RippleDrop[] {
  const active = pruneRipples(ripples, elapsed, life);
  if (active.length <= maxCount) {
    return active;
  }

  return [...active]
    .sort((a, b) => a.birthTime - b.birthTime)
    .slice(-maxCount);
}

export default function HeroImageDistortion({
  imageUrl,
  alt,
}: HeroImageDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef<HeroDistortionConfig>(DEFAULT_HERO_DISTORTION_CONFIG);
  const [useStaticImage, setUseStaticImage] = useState(true);
  const [isTextureReady, setIsTextureReady] = useState(false);
  const [config, setConfig] = useState(DEFAULT_HERO_DISTORTION_CONFIG);

  useEffect(() => {
    if (IS_DEV) {
      setConfig(loadHeroDistortionConfig());
    }
  }, []);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

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
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const aspectLocation = gl.getUniformLocation(program, "uAspect");
    const rippleCountLocation = gl.getUniformLocation(program, "uRippleCount");
    const waveNumberLocation = gl.getUniformLocation(program, "uWaveNumber");
    const omegaLocation = gl.getUniformLocation(program, "uOmega");
    const rippleLifeLocation = gl.getUniformLocation(program, "uRippleLife");
    const falloffScaleLocation = gl.getUniformLocation(program, "uFalloffScale");
    const decayRateLocation = gl.getUniformLocation(program, "uDecayRate");
    const frontSpeedLocation = gl.getUniformLocation(program, "uFrontSpeed");
    const frontWidthLocation = gl.getUniformLocation(program, "uFrontWidth");
    const refractionLocation = gl.getUniformLocation(program, "uRefraction");
    const ambientStrengthLocation = gl.getUniformLocation(
      program,
      "uAmbientStrength"
    );
    const wakeAngleLocation = gl.getUniformLocation(program, "uWakeAngle");
    const wakeSpeedBoostLocation = gl.getUniformLocation(
      program,
      "uWakeSpeedBoost"
    );
    const coverScaleLocation = gl.getUniformLocation(program, "uCoverScale");
    const texelLocation = gl.getUniformLocation(program, "uTexel");
    const textureLocation = gl.getUniformLocation(program, "uTexture");
    const rippleLocations = Array.from({ length: MAX_RIPPLE_DROPS }, (_, index) =>
      gl.getUniformLocation(program, `uRipples[${index}]`)
    );
    const rippleMetaLocations = Array.from({ length: MAX_RIPPLE_DROPS }, (_, index) =>
      gl.getUniformLocation(program, `uRippleMeta[${index}]`)
    );

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
    let startTime = performance.now();

    const targetMouse = { x: 0.5, y: 0.5 };
    const velocity = { x: 0, y: 0 };
    const coverScale = { x: 1, y: 1 };
    const lastDrop = { x: 0.5, y: 0.5 };
    let lastDropTime = 0;
    let ripples: RippleDrop[] = [];
    let canvasAspect = 1;

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
      canvasAspect = width / Math.max(height, 1);

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

    const addRipple = (ripple: RippleDrop, elapsed: number) => {
      const settings = configRef.current;
      ripples.push(ripple);

      ripples = trimRipplePool(
        ripples,
        elapsed,
        MAX_RIPPLE_DROPS,
        settings.rippleLife
      );

      lastDrop.x = ripple.x;
      lastDrop.y = ripple.y;
      lastDropTime = elapsed;
    };

    const spawnWake = (
      x: number,
      y: number,
      elapsed: number,
      strength: number,
      dirX: number,
      dirY: number,
      speed: number
    ) => {
      addRipple(
        createRippleDrop(x, y, elapsed, strength, {
          kind: "wake",
          dirX,
          dirY,
          speed,
        }),
        elapsed
      );
    };

    const spawnPebble = (
      x: number,
      y: number,
      elapsed: number,
      strength: number
    ) => {
      addRipple(
        createRippleDrop(x, y, elapsed, strength, { kind: "pebble" }),
        elapsed
      );
    };

    const render = () => {
      if (!textureInfo) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const settings = configRef.current;
      const elapsed = (performance.now() - startTime) / 1000;

      velocity.x *= settings.velocityDecay;
      velocity.y *= settings.velocityDecay;

      ripples = trimRipplePool(
        ripples,
        elapsed,
        MAX_RIPPLE_DROPS,
        settings.rippleLife
      );

      gl.clearColor(0.04, 0.04, 0.04, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.uniform1i(textureLocation, 0);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(aspectLocation, canvasAspect);
      gl.uniform1i(rippleCountLocation, ripples.length);
      gl.uniform1f(waveNumberLocation, settings.waveNumber);
      gl.uniform1f(omegaLocation, settings.omega);
      gl.uniform1f(rippleLifeLocation, settings.rippleLife);
      gl.uniform1f(falloffScaleLocation, settings.falloffScale);
      gl.uniform1f(decayRateLocation, settings.decayRate);
      gl.uniform1f(frontSpeedLocation, settings.frontSpeed);
      gl.uniform1f(frontWidthLocation, settings.frontWidth);
      gl.uniform1f(refractionLocation, settings.refraction);
      gl.uniform1f(ambientStrengthLocation, settings.ambientStrength);
      gl.uniform1f(wakeAngleLocation, settings.wakeAngle);
      gl.uniform1f(wakeSpeedBoostLocation, settings.wakeSpeedBoost);
      gl.uniform2f(coverScaleLocation, coverScale.x, coverScale.y);
      gl.uniform2f(texelLocation, 1 / canvas.width, 1 / canvas.height);

      ripples.forEach((ripple, index) => {
        const location = rippleLocations[index];
        const metaLocation = rippleMetaLocations[index];
        if (location) {
          gl.uniform4f(
            location,
            ripple.x,
            ripple.y,
            ripple.birthTime,
            ripple.strength
          );
        }
        if (metaLocation) {
          gl.uniform4f(
            metaLocation,
            ripple.dirX,
            ripple.dirY,
            ripple.speed,
            ripple.kind === "wake" ? 1 : 0
          );
        }
      });

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / rect.width;
      const nextY = 1 - (event.clientY - rect.top) / rect.height;
      const settings = configRef.current;
      const elapsed = (performance.now() - startTime) / 1000;

      const dx = nextX - targetMouse.x;
      const dy = nextY - targetMouse.y;
      velocity.x += dx * settings.velocityGain;
      velocity.y += dy * settings.velocityGain;

      targetMouse.x = Math.min(1, Math.max(0, nextX));
      targetMouse.y = Math.min(1, Math.max(0, nextY));

      const dropDx = (nextX - lastDrop.x) * canvasAspect;
      const dropDy = nextY - lastDrop.y;
      const dropDistance = Math.hypot(dropDx, dropDy);
      const timeSinceLastDrop = elapsed - lastDropTime;
      const minDropInterval = 0.14;

      if (
        dropDistance >= settings.dropMinDistance &&
        timeSinceLastDrop >= minDropInterval
      ) {
        const speed = Math.hypot(velocity.x, velocity.y);
        const strength =
          settings.dropStrength * (1 + speed * settings.speedDropBoost);
        const moveLen = Math.hypot(dropDx, dropDy);
        const dirX = moveLen > 0.0001 ? dropDx / moveLen : 1;
        const dirY = moveLen > 0.0001 ? dropDy / moveLen : 0;

        if (speed < 0.025) {
          spawnPebble(nextX, nextY, elapsed, Math.min(strength, 2.4));
        } else {
          if (dropDistance >= settings.dropMinDistance * 2.2) {
            const midX = (nextX + lastDrop.x) * 0.5;
            const midY = (nextY + lastDrop.y) * 0.5;
            spawnWake(
              midX,
              midY,
              elapsed,
              Math.min(strength * 0.82, 2.2),
              dirX,
              dirY,
              speed
            );
          }

          spawnWake(
            nextX,
            nextY,
            elapsed,
            Math.min(strength, 2.6),
            dirX,
            dirY,
            speed
          );
        }
      }
    };

    const handlePointerEnter = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const elapsed = (performance.now() - startTime) / 1000;
      const settings = configRef.current;

      spawnPebble(x, y, elapsed, settings.dropStrength);
      targetMouse.x = x;
      targetMouse.y = y;
      lastDrop.x = x;
      lastDrop.y = y;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const elapsed = (performance.now() - startTime) / 1000;
      const settings = configRef.current;

      spawnPebble(x, y, elapsed, settings.dropStrength * 1.35);
      targetMouse.x = x;
      targetMouse.y = y;
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
      startTime = performance.now();
      setIsTextureReady(true);
      resize();
      render();
    });

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
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
          className={`absolute inset-0 z-[1] h-full w-full ${
            isTextureReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      {IS_DEV && !useStaticImage ? (
        <HeroDistortionTuner config={config} onChange={setConfig} />
      ) : null}
    </>
  );
}
