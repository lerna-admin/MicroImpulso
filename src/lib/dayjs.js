import dayjs, { extend } from "dayjs";

import "dayjs/locale/en";
import "dayjs/locale/es";

import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

extend(relativeTime);
extend(updateLocale);
extend(utc);

dayjs.updateLocale("es", {
	relativeTime: {
		future: "en %s",
		past: "hace %s",
		s: "unos segundos",
		m: "un minuto",
		mm: "%d min",
		h: "una hora",
		hh: "%d horas",
		d: "un dia",
		dd: "%d dias",
		M: "un mes",
		MM: "%d meses",
		y: "un año",
		yy: "%d años",
	},
});

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: "a few sec",
		m: "a min",
		mm: "%d min",
		h: "an hour",
		hh: "%d hours",
		d: "a day",
		dd: "%d days",
		M: "a month",
		MM: "%d months",
		y: "a year",
		yy: "%d years",
	},
});

export { default as dayjs } from "dayjs";
