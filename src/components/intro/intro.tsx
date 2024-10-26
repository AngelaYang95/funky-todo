import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./intro.module.css";
import React, { useEffect } from "react";

interface IIntroProps {
    onIntroComplete: () => void;
}

export default function Intro(props: IIntroProps) {
    const stories = [
        "There always so much to do",
        "not enough time",
        "not enough coffee",
        "so here's yet another todo list",
        "(but funky)",
    ];

    // const skipInstructions = "Press 's' to skip";
    const skipInstructions = null;

    useGSAP(() => {
        console.log("init intro gsap timeline");

        var introTl = gsap.timeline({});
        introTl.fromTo("." + styles.story, {y: 200, opacity: 0, duration: 0.4}, {y: 0, opacity: 1, stagger: 1.5});
        introTl.to("." + styles.story, {y: -200, opacity: 0, stagger: 1.5}, "<1.5");
        introTl.to("." + styles.skipMessage, {y: 100, opacity: 0, duration: 0.2});
        introTl.to("." + styles.window, {opacity: 0, onComplete: props.onIntroComplete}, "+=0.1");
      }, {});

    function onKeyDown(e: React.KeyboardEvent) {
        console.log(e);
        if (e.key === 's') {
            props.onIntroComplete();
        }
    }

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