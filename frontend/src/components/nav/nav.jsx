import { Link, useResolvedPath, useMatch } from "react-router-dom";
import styles from "./nav.module.css";

export default function NavBar() {
    return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.logo}>
                Skill Share
            </Link>
            <ul className={styles.navList}>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/talents">Talents</CustomLink>
                <CustomLink to="/jobs">Jobs</CustomLink>
                <CustomLink to="/FAQ">FAQ</CustomLink>
            </ul>
            <div className={styles.spacer}>
                <CustomLink to="/sign-up" className={styles.signUpBtn}>
                    Sign up
                </CustomLink>
                <CustomLink to="/login" className={styles.loginBtn}>
                    Login
                </CustomLink>
            </div>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}
