// oxlint-disable no-unused-vars
const { React } = Spicetify;

export const EditorHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="main-trackCreditsModal-header">
    <h1 className="main-type-alto" data-encore-id="text">
      Stylizer
    </h1>
    <button className="main-trackCreditsModal-closeBtn" onClick={onClose}>
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
        <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06"></path>
      </svg>
    </button>
  </div>
);
