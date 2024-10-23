import styles from "./loader.module.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Loader() {
    return (
        <div className={styles.overlay}>
            <DotLottieReact 
                autoplay
                className={styles.lottie}
                speed={0.1}
                src={"/lottie/BasicLoader.json"}>
                </DotLottieReact>
        </div>
    );
}