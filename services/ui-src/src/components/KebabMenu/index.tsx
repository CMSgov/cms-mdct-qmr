import { useState, useRef, RefObject } from "react";
import * as CUI from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { CoreSetTableItem } from "components/Table/types";
import { useUser } from "hooks/authHooks";

export interface IKebabMenuItem {
  itemText: string;
  handleSelect: () => void;
  type?: CoreSetTableItem.Type;
}

export interface KebabMenuProps {
  menuItems: IKebabMenuItem[];
}

export const KebabMenu = ({ menuItems }: KebabMenuProps) => {
  return (
    <CUI.Menu>
      <CUI.MenuButton aria-label="Action Menu">
        <BsThreeDotsVertical />
      </CUI.MenuButton>
      <CUI.MenuList bg="blue.500" maxW="40px" p="0">
        {menuItems.map((i) => (
          <KebabMenuItem
            itemText={i.itemText}
            handleSelect={i.handleSelect}
            key={uuidv4()}
            type={i.type}
          />
        ))}
      </CUI.MenuList>
    </CUI.Menu>
  );
};

const KebabMenuItem = ({ itemText, handleSelect, type }: IKebabMenuItem) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const handleCloseDeleteDialog = () => setDeleteDialogIsOpen(false);
  const cancelRef = useRef();
  const { isStateUser } = useUser();

  const isDeleteButton = itemText.toLowerCase() === "delete";

  // dont render if this is a delete button and the user is not a state user
  if (isDeleteButton && !isStateUser) return null;

  return (
    <>
      <CUI.MenuItem
        bg="blue.500"
        color="white"
        fontWeight="bold"
        _notLast={{ borderBottomWidth: "1px" }}
        _focus={{ background: "blue.600" }}
        borderColor="white"
        minH="48px"
        onClick={
          isDeleteButton ? () => setDeleteDialogIsOpen(true) : handleSelect
        }
        aria-label={itemText}
      >
        <CUI.Text fontSize="sm">{itemText}</CUI.Text>
      </CUI.MenuItem>
      <DeleteMenuItemAlertDialog
        isOpen={deleteDialogIsOpen}
        onClose={handleCloseDeleteDialog}
        cancelRef={cancelRef}
        handleDelete={handleSelect}
        type={type}
      />
    </>
  );
};

interface DeleteMenuItemAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: RefObject<any>;
  handleDelete: () => void;
  type?: CoreSetTableItem.Type;
}

// The language contained in this Alert Dialog is specific to coresets since only coresets can be deleted atm.
const DeleteMenuItemAlertDialog = ({
  isOpen,
  onClose,
  cancelRef,
  handleDelete,
  type,
}: DeleteMenuItemAlertDialogProps) => {
  const [userInput, setUserInput] = useState("");

  let alertBodyText = "Are you sure? You can't undo this action afterwards. ";
  if (type === CoreSetTableItem.Type.CHILD) {
    alertBodyText +=
      "This will delete all Child Core Sets and their associated measures from this fiscal year's reporting.";
  } else if (type === CoreSetTableItem.Type.HEALTH_HOME) {
    alertBodyText +=
      "This will delete this Health Home Core Set and all associated measures from this fiscal year's reporting.";
  }

  return (
    <CUI.AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <CUI.AlertDialogOverlay>
        <CUI.AlertDialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            <CUI.AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Core Set
            </CUI.AlertDialogHeader>

            <CUI.AlertDialogBody>
              {alertBodyText}
              <CUI.Input
                mt="4"
                value={userInput}
                placeholder="Enter 'DELETE' to confirm"
                onChange={(e) => setUserInput(e.target.value)}
              />
              <CUI.Text fontSize="xs" fontWeight="bold">
                Enter DELETE to confirm.
              </CUI.Text>
            </CUI.AlertDialogBody>

            <CUI.AlertDialogFooter>
              <CUI.Button ref={cancelRef} onClick={onClose}>
                Cancel
              </CUI.Button>
              <CUI.Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                type="submit"
                isDisabled={userInput.toLocaleLowerCase() !== "delete"}
              >
                Delete
              </CUI.Button>
            </CUI.AlertDialogFooter>
          </form>
        </CUI.AlertDialogContent>
      </CUI.AlertDialogOverlay>
    </CUI.AlertDialog>
  );
};
