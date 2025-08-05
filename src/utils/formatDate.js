import React from 'react';

/**
 * A reusable component to format and display a date.
 * It gracefully handles null, undefined, or invalid date strings.
 * * @param {object} props
 * @param {string} props.date - The ISO date string to format (e.g., "2025-08-05T00:00:00").
 * @param {object} [props.options] - Custom options for Intl.DateTimeFormat to override the default.
 * @param {string} [props.placeholder='---'] - The text to display for invalid or missing dates.
 */
export const FormatDate = ({ date: dateString, options: customOptions, placeholder = '---' }) => {
  // Return the placeholder if the date string is falsy (null, undefined, empty)
  if (!dateString) {
    return <>{placeholder}</>;
  }

  const date = new Date(dateString);

  // Return the placeholder if the date string results in an invalid Date object
  if (isNaN(date.getTime())) {
    return <>{placeholder}</>;
  }

  // Define our default format, which can be overridden by props
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Merge default options with any custom options passed in props
  const finalOptions = { ...defaultOptions, ...customOptions };

  // Format the date using the final options
  const formattedDate = new Intl.DateTimeFormat('en-US', finalOptions).format(date);

  return <>{formattedDate}</>;
};