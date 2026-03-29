import React from 'react';
import { uploadFileAndGetPath } from './TerminalPanel';
import { isMobile } from '../env';
import { t } from '../i18n';
import styles from './ChatInputBar.module.css';

function ChatInputBar({ inputRef, inputEmpty, inputSuggestion, terminalVisible, onKeyDown, onChange, onSend, onSuggestionClick, onUploadPath }) {
  if (terminalVisible) {
    // terminal visible: only show suggestion chip
    if (!inputSuggestion) return null;
    return (
      <div className={styles.suggestionChip} onClick={onSuggestionClick}>
        <span className={styles.suggestionChipText}>{inputSuggestion}</span>
        <span className={styles.suggestionChipAction}>↵</span>
      </div>
    );
  }

  return (
    <div className={styles.chatInputBar}>
      <div className={styles.chatInputWrapper}>
        <div className={styles.chatTextareaWrap}>
          <textarea
            ref={inputRef}
            className={styles.chatTextarea}
            placeholder={inputSuggestion ? '' : t('ui.chatInput.placeholder')}
            rows={1}
            onKeyDown={onKeyDown}
            onInput={onChange}
          />
          {inputSuggestion && inputEmpty && (
            <div className={styles.ghostText}>{inputSuggestion}</div>
          )}
        </div>
        <div className={styles.chatInputHint}>
          {inputSuggestion && inputEmpty
            ? t('ui.chatInput.hintTab')
            : t('ui.chatInput.hintEnter')}
        </div>
      </div>
      {!isMobile && (
        <button
          className={styles.chatSendBtn}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const path = await uploadFileAndGetPath(file);
                onUploadPath(path);
              } catch (err) {
                console.error('[CC Viewer] Upload failed:', err);
              }
            };
            input.click();
          }}
          title={t('ui.terminal.upload')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      )}
      <button
        className={styles.chatSendBtn}
        onClick={onSend}
        disabled={inputEmpty}
        title={t('ui.chatInput.send')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}

export default ChatInputBar;
