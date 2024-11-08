import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./intro.module.css";
import React from "react";

interface IIntroProps {
    onIntroComplete: () => void;
}

const stories = [
    "There always so much to do",
    "not enough time",
    "not enough coffee",
    "so here's yet another todo list",
    "(but funky)",
];
const skipInstructions = null;

export default function Intro(props: IIntroProps) {
    
    useGSAP(() => {
        console.log("Init intro gsap timeline");

        const introTl = gsap.timeline({});
        introTl.fromTo("." + styles.story, {y: 200, opacity: 0, duration: 0.4}, {y: 0, opacity: 1, stagger: 1.5});
        introTl.to("." + styles.story, {y: -200, opacity: 0, stagger: 1.5}, "<1.5");
        introTl.to("." + styles.skipMessage, {y: 100, opacity: 0, duration: 0.2});
        introTl.to("." + styles.window, {opacity: 0, onComplete: props.onIntroComplete}, "+=0.1");
      }, {});

    return (
        <div className={styles.overlay}>
            <div className={styles.window}>
                {
                    stories.map((story: string, i: number) => 
                        <div key={i} className={styles.story}>
                            {story}
                        </div>
                    )
                }
            </div>
            {skipInstructions ? (<h4 className={styles.skipMessage}>{skipInstructions}</h4>) : (<></>)}
        </div>
    );
}