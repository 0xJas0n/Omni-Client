import React, {useState} from 'react';
import useEscapeKey from '../../hooks/useEscapeKey';

const EscapeMenu: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEscapeKey(() => {
        setIsVisible((prev) => !prev);
    });

    if (!isVisible) return null;

    return (
        <div className="escape-menu">

        </div>
    );
};

export default EscapeMenu;
