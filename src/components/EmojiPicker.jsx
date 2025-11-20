import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
export default function EmojiPicker(props) {
  const { inputRef, setInput, moreOptions, use_field } = props;

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current;
    const { selectionStart, selectionEnd, value } = input;

    const newValue =
      value.substring(0, selectionStart) +
      emoji.native +
      value.substring(selectionEnd);

    if (use_field) {
      setInput((old) => {
        return {
          ...old,
          [use_field]: newValue,
        };
      });
    } else {
      setInput(newValue);
    }

    // Set the new cursor position after the inserted emoji
    const newCursorPosition = selectionStart + emoji.native.length;
    input.focus();
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  };

  return (
    <div>
      <Picker
        {...moreOptions}
        data={data}
        onEmojiSelect={handleEmojiSelect}
        theme="dark"
        // dynamicWidth={true}
      />
    </div>
  );
}
