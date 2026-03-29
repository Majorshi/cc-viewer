import React from 'react';
import styles from './SnapLineOverlay.module.css';

function SnapLineOverlay({ isDragging, activeSnapLine, snapLines, terminalWidth, containerRef }) {
  if (!isDragging) return null;

  const container = containerRef.current;
  if (!container) return null;
  const containerWidth = container.getBoundingClientRect().width;
  const resizerWidth = 5;

  // snap preview
  let snapPreview = null;
  if (activeSnapLine) {
    const currentLeft = containerWidth - terminalWidth - resizerWidth;
    const snapLeft = activeSnapLine.linePosition;
    const left = Math.min(currentLeft, snapLeft);
    const width = Math.abs(snapLeft - currentLeft);
    snapPreview = (
      <div
        className={styles.snapPreview}
        style={{ left: `${left}px`, width: `${width}px` }}
      />
    );
  }

  // nearest snap line
  const currentLinePos = containerWidth - terminalWidth - resizerWidth;
  const sorted = [...snapLines]
    .map(snap => ({ ...snap, dist: Math.abs(snap.linePosition - currentLinePos) }))
    .sort((a, b) => a.dist - b.dist);

  let snapLineEl = null;
  if (sorted.length > 0) {
    const snap = sorted[0];
    const isActive = activeSnapLine && activeSnapLine.cols === snap.cols;
    snapLineEl = (
      <div
        key={snap.cols}
        className={isActive ? styles.snapLineActive : styles.snapLine}
        style={{ left: `${snap.linePosition}px` }}
      />
    );
  }

  return (
    <>
      {snapPreview}
      {snapLineEl}
    </>
  );
}

export default SnapLineOverlay;
