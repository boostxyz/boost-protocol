import type { FC } from 'react';

interface InfoTextProps {
  label: string;
  value: string | undefined;
}

const InfoText: FC<InfoTextProps> = ({ label, value = 'N/A', ...props }) => (
  <div {...props}>
    {label}: <span>{value}</span>
  </div>
);

export default InfoText;
