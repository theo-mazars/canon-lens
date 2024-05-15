import { hydrate, prerender as ssr } from 'preact-iso';

import buildIcon from './assets/build.svg';
import './style.css';
import { useEffect, useState } from 'preact/hooks';
import { JSX } from 'preact';
import { createPortal } from 'preact/compat';

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

export function App() {
	const [settings, setSettings] = useState({ mount: "FL", sn: "" });
	const [result, setResult] = useState<string[] | null>([]);

	useEffect(() => {
		console.log(settings);
	}, [settings]);

	const handleMountChange = (e: any) => {
		setSettings((s) => ({ ...s, mount: (e.target as HTMLButtonElement).value }));
	};

	const handleChange = (e: any) => {
		const value = (e.target as HTMLInputElement).value;

		if (value === "") setSettings((s) => ({ ...s, sn: "" }));

		setSettings((s) => ({ ...s, sn: value.toUpperCase() }));
	};

	const handleCheck = () => {
		if (settings.sn === "") {
			setResult(null);
			return;
		}

		const regRes = reg.exec(settings.sn);

    if (!regRes) return setResult(null);

    const [_, snyear, __, loc, year, month, day] = regRes;

		if (snyear) {
      setResult(null);
    } else if (year) {
			const charAsciiA = 65;
      const years = [
        year.charCodeAt(0) + 1960 - charAsciiA,
        year.charCodeAt(0) + 1986 - charAsciiA,
        year.charCodeAt(0) + 2012 - charAsciiA,
      ].reduce((acc, cur) => {
        const mnt = mounts.find((m) => m.id === settings.mount);

        if (cur > new Date().getFullYear()) return acc;
        if (!mnt?.start || !mnt?.end) return [...acc, cur];
        if (cur >= mnt.start && cur <= mnt.end) return [...acc, cur];
        return acc;
      }, []);
      if (years.length === 0) return setResult(null);
			setResult(years.map((y) => `${day} ${months[parseInt(month) - 1]} ${y}`));
    } else setResult(null);
	};

	return (
		<div>
			<header className="Header">
				<h1>Canon Lens - Build Date</h1>
			</header>
			<section className="Form">
				<h2>Enter your build number</h2>
				<div className="MountSelector">
					{mounts.map(({ id, name }) => {
						return (
							<button
								className={`Item ${id === settings.mount ? "Active" : ""}`}
								onClick={handleMountChange}
								key={id}
								value={id}
							>
								{name}
							</button>
						)
					})}
				</div>
				<input
					type="text"
					onKeyUp={handleChange}
					value={settings.sn}
					placeholder="Serial Number"
					className={result === null ? "Error" : ""}
					id="SearchBar"
				/>
				{result === null ? <label className="Error" for="SearchBar">Unable to find a match</label> : <></>}
				<button className="Search" onClick={handleCheck}>Check</button>
			</section>
			{result?.length > 0 ? (
				<section className="Result">
					<h2>Results</h2>
					<div className="List">
						{result.map((date) => {
							return (
								<div className="Item">
									<div className="Icon"><img src={buildIcon} /></div>
									<div className="Info">
										<div className="Title">Possible build date</div>
										<div className="Date">{date}</div>
									</div>
								</div>
							)
						})}
					</div>
				</section>
			) : (
				<></>
			)}
		</div>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
