import React from 'react';

export function usePanelResize(
  leftPanelRef: React.RefObject<HTMLDivElement | null>,
  setPanelWidth: (width: number) => void
) {
  const resizeStateRef = React.useRef<{ isResizing: boolean }>({ isResizing: false });

  const handleResize = React.useCallback(
    (event: MouseEvent) => {
      const panel = leftPanelRef.current;
      if (panel?.parentElement) {
        const newWidth = (event.clientX / panel.parentElement.offsetWidth) * 100;
        if (newWidth > 15 && newWidth < 85) setPanelWidth(newWidth);
      }
    },
    [leftPanelRef, setPanelWidth]
  );

  const stopResize = React.useCallback(() => {
    resizeStateRef.current.isResizing = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
  }, [handleResize]);

  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      resizeStateRef.current.isResizing = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', stopResize);
    },
    [handleResize, stopResize]
  );
}
