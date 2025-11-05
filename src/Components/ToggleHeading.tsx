import { useState, type ReactElement } from "react";

export function ToggleHeading(props: {title: string, content: ReactElement}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <h2 
        onClick={() => setIsOpen(!isOpen)}
        className="clickable">
        {props.title}
      </h2>
      {isOpen ? props.content : null}
    </>
  )
}import("react")