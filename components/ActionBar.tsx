import React, { useState, useEffect } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { CheckIcon, DotFilledIcon } from '@radix-ui/react-icons';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import './component_styles/ActionBar.css';
import { getLoggedUser } from './api';
import { useNavigate, Link } from 'react-router-dom';

const CHECK_ITEMS = ['Show P2P Samples/Loops', 'Show Fiat Samples/Loops'];

export const ActionBar = () => {
  const [checkedSelection, setCheckedSelection] = useState([CHECK_ITEMS[1]]);
  const [radioSelection, setRadioSelection] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  // Fetch the logged-in user
  useEffect(() => {
    getLoggedUser().then(user => setLoggedUser(user));
  }, []);

  // Fetch labels owned by the logged-in user
  const { data: labels, error, isValidating } = useFrappeGetDocList('Label', {
    fields: ["title"],
    filters: loggedUser ? { "owner": loggedUser } : null, // Filter by the owner
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  const RADIO_ITEMS = labels ? labels.map(label => label.title) : [];
  const navigate = useNavigate();
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey)) {
      if (e.key === 'g') {
        e.preventDefault(); // Prevent the default browser action
        navigate('/create-release'); // Navigate to create-release page
      } else if (e.key === 'm') {
        e.preventDefault(); // Prevent the default browser action
        navigate('/manage-releases'); // Navigate to manage-releases page
      }
    }
  };

  useEffect(() => {
    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Return a cleanup function to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array so that the effect is only run once

  useEffect(() => {
    if (RADIO_ITEMS.length > 0) {
      setRadioSelection(RADIO_ITEMS[0]);
    }
  }, [RADIO_ITEMS]);


  return (
    <Menubar.Root className="MenubarRoot">
      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger">Publish</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="MenubarContent" align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item className="MenubarItem">
              <Link to="/create-release">Create New Release <div className="RightSlot">⌘ G</div></Link>
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
