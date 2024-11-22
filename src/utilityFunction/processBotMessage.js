import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const processBotMessage = (output) => {
  let botMsg = { type: 'bot', content: '' };

  if (output.includes('data:image/') && output.includes('data:audio/')) {
    // Handle text, image, and audio
    const [textPart, imageAndAudioPart] = output.split('data:image/');
    const [imagePart, audioPart] = imageAndAudioPart.split('data:audio/');
    
    if (textPart.trim()) {
      const rawHtml = marked(textPart.trim());
      botMsg.content = DOMPurify.sanitize(rawHtml);
    }
    
    if (imagePart) {
      const imageUrl = `data:image/${imagePart.trim()}`;
      botMsg.content += `
        <div>
          <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" />
          <div style="text-align: right;">
            <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
          </div>
        </div>`;
      botMsg.isImage = true;
    }
    
    if (audioPart) {
      const audioUrl = `data:audio/${audioPart.trim()}`;
      botMsg.content += `
        <div>
          <audio controls>
            <source src="${audioUrl}" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>`;
      botMsg.isAudio = true;
    }
  } else if (output.includes('data:image/')) {
    // Handle text and image
    const [textPart, imagePart] = output.split('data:image/');
    if (textPart.trim()) {
      const rawHtml = marked(textPart.trim());
      botMsg.content = DOMPurify.sanitize(rawHtml);
    }
    const imageUrl = `data:image/${imagePart.trim()}`;
    botMsg.content += `
      <div>
        <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" />
        <div style="text-align: right;">
          <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
        </div>
      </div>`;
    botMsg.isImage = true;
  } else if (output.includes('data:audio/')) {
    // Handle text and audio
    const [textPart, audioPart] = output.split('data:audio/');
    if (textPart.trim()) {
      const rawHtml = marked(textPart.trim());
      botMsg.content = DOMPurify.sanitize(rawHtml);
    }
    const audioUrl = `data:audio/${audioPart.trim()}`;
    botMsg.content += `
      <div>
        <audio controls>
          <source src="${audioUrl}" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>`;
    botMsg.isAudio = true;
  } else if (output.includes('"ui_code": "PronunciationUI"')) {
    botMsg.ui_code = 'PronunciationUI';
  } else {
    // Handle text only
    const rawHtml = marked(output);
    botMsg.content = DOMPurify.sanitize(rawHtml);
  }

  return botMsg;
};