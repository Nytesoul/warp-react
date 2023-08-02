import { classNames } from '@chbphone55/classnames';
import { modal as ccModal } from '@warp-ds/css/component-classes';
import React, { useEffect, useRef } from 'react';
import { useI18n, useId } from '../../utils/src';
import FocusLock from 'react-focus-lock';
import { ModalProps } from './props';
import { setup, teardown } from 'scroll-doctor';
import { i18n } from '@lingui/core';

/**
 * A Modal dialog that renders on top the page
 */
export const Modal = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId(props.id);

  useI18n('modal');

  useEffect(() => {
    teardown();
    if (!contentRef.current) return;
    props.open && setup(contentRef.current);
  }, [props.open, contentRef]);

  useEffect(() => {
    if (!props.initialFocusRef) return;
    props.initialFocusRef.current?.focus();
  }, [props.open, props.initialFocusRef]);

  if (!props.open) return <></>;

  return (
    <FocusLock>
      <div
        onClick={props.onDismiss}
        className={classNames(props.className, ccModal.backdrop, ccModal.transparentBg)}
        style={{ ...props.style }}
      >
        <div
          role="dialog"
          aria-modal="true"
          id={id}
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label={ariaLabel}
          aria-labelledby={
            ariaLabelledBy ??
            (props.title && !ariaLabel ? `${id}__title` : undefined)
          }
          onKeyDown={(event) => {
            if (!props.onDismiss) return;
            if (event.key === 'Escape') {
              props.onDismiss();
            }
          }}
          className={ccModal.modal}
          tabIndex={-1}
        >
          <div className={ccModal.title}>
            {typeof props.left === 'boolean' && props.left ? (
              <button
                type="button"
                aria-label={i18n._(
                  /*i18n*/ {
                    id: 'modal.aria.back',
                    message: 'Back',
                    comment: 'Aria label for the back button in modal',
                  },
                )}
                className={classNames(
                  ccModal.transitionTitle,
                  ccModal.titleButton,
                  ccModal.titleButtonLeft,
                )}
                onClick={props.onDismiss}
              >
                <svg
                  className={classNames(
                    ccModal.titleButtonIcon,
                    ccModal.titleButtonIconRotated,
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="nonzero"
                    d="M8 2.25a.75.75 0 01.743.648L8.75 3v8.189l3.72-3.72a.75.75 0 011.133.977l-.073.084-5 5a.747.747 0 01-.374.204l-.104.014h-.104a.747.747 0 01-.478-.218l-5-5a.75.75 0 01.976-1.133l.084.073 3.72 3.719V3A.75.75 0 018 2.25z"
                  ></path>
                </svg>
              </button>
            ) : (
              props.left
            )}

            <div
              id={`${id}__title`}
              className={classNames(
                ccModal.transitionTitle,
                !!props.left ? ccModal.transitionTitleCenter : ccModal.transitionTitleColSpan
              )}
            >
              {typeof props.title === 'string' ? (
                <p className={ccModal.titleText}>{props.title}</p>
              ) : (
                props.title
              )}
            </div>

            {typeof props.right === 'boolean' && props.right ? (
              <button
                type="button"
                aria-label={i18n._(
                  /*i18n*/ {
                    id: 'modal.aria.close',
                    message: 'Close',
                    comment: 'Aria label for the close button in modal',
                  },
                )}
                onClick={props.onDismiss}
                className={classNames(
                  ccModal.transitionTitle,
                  ccModal.titleButton,
                  ccModal.titleButtonRight,
                )}
              >
                <svg
                  className={ccModal.titleButtonIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 12l6 6-6-6-6 6 6-6zm0 0L6 6l6 6 6-6-6 6z"
                  />
                </svg>
              </button>
            ) : (
              props.right
            )}
          </div>
          <div ref={contentRef} className={ccModal.content}>
            {props.children}
          </div>

          {!!props.footer && <div className={ccModal.footer}>{props.footer}</div>}
        </div>
      </div>
    </FocusLock>
  );
};
