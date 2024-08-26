import type { FC } from 'react';

import { type BoxProps, Text } from '@chakra-ui/react';

interface InfoTextProps extends BoxProps {
  label: string;
  value: string | undefined;
}

const InfoText: FC<InfoTextProps> = ({ label, value = 'N/A', ...props }) => (
  <Text {...props}>
    {label}:{' '}
    <Text as="span" fontWeight="800">
      {value}
    </Text>
  </Text>
);

export default InfoText;
