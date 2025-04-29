import React, {useState} from 'react';
import useEscapeKey from '../../../hooks/useEscapeKey';
import './EscapeMenu.css';

const EscapeMenu: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEscapeKey(() => {
        setIsVisible((prev) => !prev);
    });

    if (!isVisible) return null;

    return (
        <div className="escape-menu">
            <ul className="escape-menu__list" role="list">
                <li>
                    <button type="button" className="button" variant="primary">Resume</button>
                </li>

                <li>
                    <button type="button" className="button" variant="primary">Settings</button>
                </li>

                <li>
                    <button type="button" className="button" variant="primary">Quit</button>
                </li>
            </ul>
        </div>
    );
};

export default EscapeMenu;
