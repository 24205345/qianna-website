"use client";
interface Props {
  title: string; changed: boolean; overridden: boolean;
  onPick: () => void; onReset: () => void; onCancel: () => void;
}
export default function FeaturedImageControls({ title, changed, overridden, onPick, onReset, onCancel }: Props) {
  const buttonClass = "rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 disabled:opacity-40";
  return <div className="flex flex-wrap gap-1.5 border-t border-stone-200 bg-white p-2">
    <button type="button" aria-label={`更换图片：${title}`} className={buttonClass} onClick={onPick}>更换图片</button>
    <button type="button" aria-label={`恢复原图：${title}`} className={buttonClass} onClick={onReset} disabled={!changed && !overridden}>恢复原图</button>
    {changed ? <>
      <button type="button" aria-label={`取消修改：${title}`} className={buttonClass} onClick={onCancel}>取消修改</button>
      <span className="w-full text-[11px] text-stone-500">待保存</span>
    </> : null}
  </div>;
}
