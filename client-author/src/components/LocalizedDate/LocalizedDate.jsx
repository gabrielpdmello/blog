function LocalizedDate({ timestamp }) {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

  return <time dateTime={date.toISOString()}>{formattedDate}</time>;
}

export default LocalizedDate;
