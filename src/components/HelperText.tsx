import { Tooltip } from 'primereact/tooltip';

export const HelperText: React.FC<{ helperText: string }> = ({ helperText }) => {
    return (
        <>
            <Tooltip target=".pi-info-circle" />
            <i
                className="pi pi-info-circle text-gray-500"
                data-pr-tooltip={helperText}
                data-pr-position="top"
                data-pr-at="center top-10"
                data-pr-my="center bottom"
                style={{ fontSize: '1rem', cursor: 'pointer' }}
            ></i>
        </>
    );
};