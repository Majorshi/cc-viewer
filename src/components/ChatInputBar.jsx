import React, { useState } from 'react';
import { uploadFileAndGetPath } from './TerminalPanel';
import { isMobile } from '../env';
import { t } from '../i18n';
import styles from './ChatInputBar.module.css';

function ChatInputBar({ inputRef, inputEmpty, inputSuggestion, terminalVisible, onKeyDown, onChange, onSend, onSuggestionClick, onUploadPath }) {
  const [plusOpen, setPlusOpen] = useState(false);

  if (terminalVisible) {
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
        <div className={styles.chatInputBottom}>
          <div className={styles.plusArea}>
            <button className={styles.plusBtn} onClick={() => setPlusOpen(p => !p)} title={t('ui.chatInput.more')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            {plusOpen && (
              <>
              <div className={styles.plusOverlay} onClick={() => setPlusOpen(false)} />
              <div className={styles.plusMenu}>
                <button className={styles.plusMenuItem} onClick={() => {
                  setPlusOpen(false);
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
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{t('ui.terminal.upload')}</span>
                </button>
              </div>
              </>
            )}
          </div>
          <div className={styles.chatInputHint}>
            {inputSuggestion && inputEmpty
              ? t('ui.chatInput.hintTab')
              : t('ui.chatInput.hintEnter')}
          </div>
          <button
            className={`${styles.sendBtn} ${inputEmpty ? styles.sendBtnDisabled : ''}`}
            onClick={onSend}
            disabled={inputEmpty}
            title={t('ui.chatInput.send')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBar;
