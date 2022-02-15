import { useState } from "react";
import * as CUI from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";

interface DeleteWrapperProps extends CUI.ColorProps {
  children: React.ReactNode;
  onDelete?: () => void;
  allowDeletion?: boolean;
  childWrapperProps?: CUI.BoxProps;
  showText?: boolean;
}

export const DeleteWrapper = ({
  children,
  onDelete,
  childWrapperProps,
  color = "blue.600",
  textColor = "blue.600",
  showText = true,
  allowDeletion,
}: DeleteWrapperProps) => {
  const [render, setRender] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!render) return null;

  return (
    <CUI.Box position="relative" {...childWrapperProps}>
      {allowDeletion && (
        <CUI.HStack
          top={0}
          right={showText ? "-6rem" : "-3rem"}
          zIndex={2}
          position={"absolute"}
          padding={2}
          as={"button"}
          border={"1px"}
          borderRadius={"md"}
          borderColor={color}
          alignItems={"center"}
          data-testid="delete-wrapper"
          aria-label="Delete Field"
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            onDelete && onDelete();
            setRender(false);
          }}
          tabIndex={-1}
        >
          {isHovered && showText && (
            <CUI.Text size={"sm"} color={textColor}>
              Delete
            </CUI.Text>
          )}
          <CUI.Icon color={textColor} fontSize={"xl"} as={BsTrash} />
        </CUI.HStack>
      )}
      {children}
    </CUI.Box>
  );
};
