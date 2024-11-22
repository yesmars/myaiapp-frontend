

export const selectHighLightedText = (text) => {
    const selection = window.getSelection();
    const highlightedText = selection.toString().trim();
    return highlightedText;
}