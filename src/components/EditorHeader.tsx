const { React } = Spicetify;

export const EditorHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="main-trackCreditsModal-header" style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "var(--spice-main)",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  } as React.CSSProperties}>
    <div style={{
      cursor: "move",
      WebkitAppRegion: "drag",
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: "white",
    } as React.CSSProperties}>
      <h1 className="main-type-alto" data-encore-id="text" >Stylizer</h1>
    </div>
    <button
      className="main-trackCreditsModal-closeBtn"
      tabIndex={-1}
      onClick={onClose}
      style={{
        cursor: "pointer",
        WebkitAppRegion: "no-drag",
        flexShrink: 0,
        marginLeft: "8px",
      } as React.CSSProperties}>
      <svg
        data-encore-id="icon"
        role="img"
        aria-label="Close"
        aria-hidden="false"
        className="e-91000-icon e-91000-baseline"
        viewBox="0 0 16 16"
        style={
          {
            "--encore-icon-height":
              "var(--encore-graphic-size-informative-smaller);",
            "--encore-icon-width":
              "var(--encore-graphic-size-informative-smaller);",
          } as React.CSSProperties
        }
      >
        <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06" fill="currentColor"></path>
      </svg>
    </button>
  </div>
);
