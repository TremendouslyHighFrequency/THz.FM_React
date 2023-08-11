import React, { useState, useEffect } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { CheckIcon, DotFilledIcon } from '@radix-ui/react-icons';
import { useFrappeGetDocList } from 'frappe-react-sdk'; // Import the hook
import './component_styles/ActionBar.css';
import { getLoggedUser } from './api';

const CHECK_ITEMS = ['Show P2P Samples/Loops', 'Show Fiat Samples/Loops'];

export const ActionBar = () => {
  const [checkedSelection, setCheckedSelection] = useState([CHECK_ITEMS[1]]);
  const [loggedUser, setLoggedUser] = useState(null);
  const { data: labels, error, isValidating } = useFrappeGetDocList('Label', {
    fields: ["title", "owner"],
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  const RADIO_ITEMS = labels ? labels.map(label => label.title) : [];


  return (
    <Menubar.Root className="MenubarRoot">
      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">Publish</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="MenubarContent" align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item className="MenubarItem">
              Create New Release <div className="RightSlot">⌘ G</div>
            </Menubar.Item>
            <Menubar.Item className="MenubarItem">
              Manage Releases <div className="RightSlot">⌘ M</div>
            </Menubar.Item>
            <Menubar.Separator className="MenubarSeparator" />
            <Menubar.Item className="MenubarItem">
              Print… <div className="RightSlot">⌘ P</div>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">Workspace</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="MenubarContent"
            align="start"
            sideOffset={5}
            alignOffset={-14}
          >
            {CHECK_ITEMS.map((item) => (
              <Menubar.CheckboxItem
                className="MenubarCheckboxItem inset"
                key={item}
                checked={checkedSelection.includes(item)}
                onCheckedChange={() =>
                  setCheckedSelection((current) =>
                    current.includes(item)
                      ? current.filter((el) => el !== item)
                      : current.concat(item)
                  )
                }
              >
                <Menubar.ItemIndicator className="MenubarItemIndicator">
                  <CheckIcon />
                </Menubar.ItemIndicator>
                {item}
              </Menubar.CheckboxItem>
            ))}
            <Menubar.Separator className="MenubarSeparator" />
            <Menubar.Item className="MenubarItem inset">
              Samples <div className="RightSlot">⌘ L</div>
            </Menubar.Item>
            <Menubar.Item className="MenubarItem inset">
              Loops <div className="RightSlot">⇧ ⌘ L</div>
            </Menubar.Item>
            <Menubar.Separator className="MenubarSeparator" />
            <Menubar.Item className="MenubarItem inset">DAW</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">Labels</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="MenubarContent"
            align="start"
            sideOffset={5}
            alignOffset={-14}
          >
            <Menubar.RadioGroup value={radioSelection} onValueChange={setRadioSelection}>
              {RADIO_ITEMS.map((item) => (
                <Menubar.RadioItem className="MenubarRadioItem inset" key={item} value={item}>
                  <Menubar.ItemIndicator className="MenubarItemIndicator">
                    <DotFilledIcon />
                  </Menubar.ItemIndicator>
                  {item}
                </Menubar.RadioItem>
              ))}
              <Menubar.Separator className="MenubarSeparator" />
              <Menubar.Item className="MenubarItem inset">Add Label…</Menubar.Item>
            </Menubar.RadioGroup>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
