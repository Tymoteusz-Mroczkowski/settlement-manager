import { useState, type ReactElement } from "react";

export function ToggleHeading(props: {title: string, content: ReactElement}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <h3 
        onClick={() => setIsOpen(!isOpen)}
        className="clickable">
        {props.title}
      </h3>
      {isOpen ? props.content : null}
    </>
  )
}import("react")