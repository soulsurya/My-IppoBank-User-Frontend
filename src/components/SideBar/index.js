import React from 'react'
import css from './SideBar.module.css'
const Sidebar = (props) => {
    let { setOptionStatus, menuOptions, optionStatus } = props;
    return (
        <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <ul className={css.menuList}>
                <li
                    onClick={() => {
                        setOptionStatus(menuOptions.HOME);
                    }}
                    className={`${css.menuItem} ${optionStatus === menuOptions.HOME ? css.isActive : ""
                        } `}
                >
                    Home
                </li>
                <li
                    onClick={() => {
                        setOptionStatus(menuOptions.ACCOUNT);
                    }}
                    className={`${css.menuItem} ${optionStatus === menuOptions.ACCOUNT ? css.isActive : ""
                        } `}
                >
                    Accounts
                </li>
                <li
                    onClick={() => {
                        setOptionStatus(menuOptions.LOAN);
                    }}
                    className={`${css.menuItem}  ${optionStatus === menuOptions.LOAN ? css.isActive : ""
                        } `}
                >
                    Loans
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar