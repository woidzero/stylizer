const { React, ReactDOM } = Spicetify
const { useState, useEffect, useRef, createContext, useContext } = React;

const PipContext = createContext<{ pipWindow: Window | null }>({ pipWindow: null });
export const usePiPWindow = () => useContext(PipContext);

interface PipPortalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const PiPPortal: React.FC<PipPortalProps> = ({
  isOpen,
  onClose,
  width = 600,
  height = 700,
  children,
}) => {
  const [pipContainer, setPipContainer] = useState<HTMLElement | null>(null);
  const [pipWin, setPipWin] = useState<Window | null>(null);

  const pipWinRef = useRef<Window | null>(null);
  const isClosingByReactRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const copyStyles = (targetDoc: Document) => {
    Array.from(document.styleSheets).forEach((styleSheet) => {
      try {
        if (styleSheet.cssRules) {
          const newStyle = targetDoc.createElement("style");
          Array.from(styleSheet.cssRules).forEach((rule) => {
            newStyle.appendChild(targetDoc.createTextNode(rule.cssText));
          });
          targetDoc.head.appendChild(newStyle);
        } else if (styleSheet.href) {
          const newLink = targetDoc.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href = styleSheet.href;
          targetDoc.head.appendChild(newLink);
        }
      } catch (e) {
        if (styleSheet.href) {
          const newLink = targetDoc.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href = styleSheet.href;
          targetDoc.head.appendChild(newLink);
        }
      }
    });

    document.querySelectorAll("style:not(#stylizer-user-css)").forEach((styleEl) => {
      targetDoc.head.appendChild(styleEl.cloneNode(true));
    });
  };

  useEffect(() => {
    if (!isOpen) {
      if (pipWinRef.current) {
        isClosingByReactRef.current = true;
        const win = pipWinRef.current;
        pipWinRef.current = null;
        setPipWin(null);
        setPipContainer(null);
        win.close();
      }
      return;
    }

    if (!("documentPictureInPicture" in window)) {
      console.error("[stylizer] PiP API not supported.");
      return;
    }

    isClosingByReactRef.current = false;
    let isCancelled = false;

    const openPip = async () => {
      try {
        // @ts-ignore
        const win = await window.documentPictureInPicture.requestWindow({
          width,
          height,
        });

        if (isCancelled || isClosingByReactRef.current) {
          win.close();
          return;
        }

        pipWinRef.current = win;
        setPipWin(win);

        win.document.title = "Stylizer";
        copyStyles(win.document);

        win.document.body.style.margin = "0";
        win.document.body.style.padding = "0";
        win.document.body.style.backgroundColor = "#121212";
        win.document.body.style.height = "100vh";
        win.document.body.style.overflow = "hidden";
        win.document.body.style.display = "block";
        win.document.body.style.minWidth = "0";

        const handlePageHide = () => {
          if (!isClosingByReactRef.current && pipWinRef.current) {
            pipWinRef.current = null;
            setPipWin(null);
            setPipContainer(null);
            onCloseRef.current();
          }
        };

        win.addEventListener("pagehide", handlePageHide);
        setPipContainer(win.document.body);
      } catch (err) {
        console.error("[stylizer] PiP window error:", err);
      }
    };

    openPip();

    return () => {
      isCancelled = true;
      if (pipWinRef.current) {
        isClosingByReactRef.current = true;
        const win = pipWinRef.current;
        pipWinRef.current = null;
        setPipWin(null);
        setPipContainer(null);
        win.close();
      }
    };
  }, [isOpen]);

  if (!isOpen || !pipContainer || !pipWin) return null;

  return ReactDOM.createPortal(
    <PipContext.Provider value={{ pipWindow: pipWin }}>
      {children}
    </PipContext.Provider>,
    pipContainer
  );
};
