import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';


const DialogDemo = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet">Purchase</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Choose payment method</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          This artist accepts both USD and ERG.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="usd-button">
            USD
          </label>
          <input className="Button green" id="usd-button" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="erg-button">
            ERG
          </label>
          <input className="Button orange" id="erg-button" />
        </fieldset>
        {/* <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button className="Button green">Save changes</button>
          </Dialog.Close>
        </div> */}
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo;