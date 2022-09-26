import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const mounts = [
  { id: "FL", name: "FL", start: 1960, end: 1985 },
  { id: "FD", name: "FD", start: 1965, end: 1985 },
  { id: "EF", name: "EF", start: 1986, end: 2037 },
  { id: "EFS", name: "EF-S", start: 2010, end: 2037 },
  { id: "RF", name: "RF", start: 2016, end: 2037 },
];

const reg = /^([0-9]{2})([0-9]{8})$|^(F|U|O)?([A-Z])([0-9]{1,2})([0-9]{2})$/;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Home() {
  const [settings, setSettings] = useState({ mount: null, sn: null });
  const [result, setResult] = useState(null);

  const updateMount = ({ target: { id } }) => {
    if (id === settings.mount) setSettings({ ...settings, mount: null });
    else setSettings({ ...settings, mount: id });
  };

  const handleChange = ({ target: { value } }) => {
    if (value === "") setSettings({ ...settings, sn: null });
    else setSettings({ ...settings, sn: value.toUpperCase() });
  };

  useEffect(() => {
    const regRes = reg.exec(settings.sn);

    if (!regRes) return setResult(null);

    const [_, snyear, __, loc, year, month, day] = regRes;

    if (snyear) {
      setResult(null);
    } else if (year) {
      const years = [
        year.charCodeAt(0) + 1895,
        year.charCodeAt(0) + 1921,
        year.charCodeAt(0) + 1947,
      ].reduce((acc, cur) => {
        const mnt = mounts.find((m) => m.id === settings.mount);

        if (cur > new Date().getFullYear()) return acc;
        if (!mnt?.start || !mnt?.end) return [...acc, cur];
        if (cur >= mnt.start && cur <= mnt.end) return [...acc, cur];
        return acc;
      }, []);
      if (years.length === 0) return setResult(null);
      setResult(`${day} ${months[parseInt(month) - 1]} ${years.join(" or ")}`);
    } else setResult(null);

    console.log(regRes);
  }, [settings]);

  return (
    <div className={styles.container}>
      <div className={styles.FormBox}>
        <div className={styles.FormBox__title}>Canon Lens build year</div>
        <div className={styles.FormBox__mounts}>
          {mounts.map(({ id, name }) => (
            <button
              className={`${styles.FormBox__mount} ${
                id === settings.mount ? styles["FormBox__mount--active"] : ""
              }`}
              id={id}
              key={id}
              onClick={updateMount}
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.FormBox__sn}>
          <input
            type="text"
            placeholder="Build No (XX####)"
            onChange={handleChange}
          />
        </div>
        <div className={styles.FormBox__result}>
          {(settings.sn === null && " ") || result || "Unable to find a match"}
        </div>
      </div>
    </div>
  );
}
