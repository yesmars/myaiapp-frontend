
import { useEffect, useRef } from "react";
import highlightjs from "highlight.js";
import 'highlight.js/styles/atom-one-dark.css';


const useConversationformattingEffect = (conversation, userHasScrolled,setUserHasScrolled,scrollToBottom) => {
    const bottomRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            setUserHasScrolled(true);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [conversation, setUserHasScrolled]);
    //scroll to the bottom of the conversation  when the conversation state changes
    useEffect(() => {
        if(!userHasScrolled){
        scrollToBottom();}
    }, [conversation,userHasScrolled,scrollToBottom]);
    
    // Apply syntax highlighting after conversation updates
    useEffect(() => {
        highlightjs.highlightAll();
    }, [conversation]);

    useEffect(() => {
        const handleCopyClick = (event) => {
            if (event.target && event.target.className === 'copy-code-button') {
                const code = event.target.nextElementSibling.textContent;
                navigator.clipboard.writeText(code);
    
                const originalText = event.target.textContent;
                event.target.textContent = 'Copied!';
                setTimeout(() => {
                    if (event.target) {
                        event.target.textContent = originalText;
                    }
                }, 2000);
            }
        };
    
        const addCopyButtons = () => {
            // Remove existing copy buttons to prevent duplication
            const existingButtons = document.querySelectorAll('.copy-code-button');
            existingButtons.forEach(button => button.remove());
    
            // Add new copy buttons
            const codeElements = document.querySelectorAll('pre code');
            codeElements.forEach((element) => {
                // Create a wrapping container (if not already wrapped)
                let wrapper = element.parentElement;
                if (!wrapper.classList.contains('code-block-container')) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'code-block-container';
                    element.parentNode.insertBefore(wrapper, element);
                    wrapper.appendChild(element);
                }
    
                // Create and insert the copy button
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.className = 'copy-code-button';
    
                // Insert the copy button at the top right
                wrapper.insertBefore(copyButton, wrapper.firstChild);
            });
        };
    
        // Attach click event listener
        document.addEventListener('click', handleCopyClick);
    
        // Add copy buttons
        addCopyButtons();
    
        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleCopyClick);
        };
    }, [conversation]); // Only rerun this effect when the conversation changes
    
    return bottomRef;
}
export default useConversationformattingEffect;