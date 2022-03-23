import { Space, Text } from "@mantine/core";
import styled from "styled-components";
import { useTheme } from "../hooks/useTheme";
import Image from "../images/empty.svg";

export interface ConfirmModalProps {
  title: string;
  text: string;
  button?: JSX.Element;
  size?: "md" | "lg";
}

const SIZE_TO_IMAGE_SIZE = {
  md: 200,
  lg: 300,
};

function EmptyState({ title, text, button, size = "md" }: ConfirmModalProps) {
  const theme = useTheme();

  return (
    <Container>
      <Img src={Image} alt="" height={SIZE_TO_IMAGE_SIZE[size]} width={300} />
      <Text size="xl" weight={600} color={theme.color.foreground}>
        {title}
      </Text>
      <Text size="sm" color={theme.color.foreground}>
        {text}
      </Text>
      <Space h={20} />
      {button}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Img = styled.img`
  -webkit-user-drag: none;
  user-select: none;
`;

export default EmptyState;
