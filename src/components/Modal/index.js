import React from "react";

import css from "./Modal.module.css";

import { Modal as MaterialUiModal, Backdrop, Fade } from "@material-ui/core";

export default function Modal(props) {
  return (
    <div>
      <MaterialUiModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={css.modal}
        open={props.isModalOpen}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{...props.style}}
      >
        <Fade in={props.isModalOpen}>
          <div className={css.paper}>{props.children}</div>
        </Fade>
      </MaterialUiModal>
    </div>
  );
}
