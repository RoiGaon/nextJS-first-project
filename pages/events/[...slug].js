import { Fragment } from "react";
import { useRouter } from "next/router";
import { getFilteredEvents } from "../../helpers/api-util";
import EventList from "../../components/events/event-list";
import ResultTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

function FilteredEventsPage(props) {
  // const router = useRouter();
  // const filteredData = router.query.slug;
  // const filteredYear = filteredData[0];
  // const filteredMonth = filteredData[1];
  // const numYear = +filteredYear;
  // const numMonth = +filteredMonth;

  // if (!filteredData) {
  //   return <p className="center">Loading...</p>;
  // }

  if (props.hasError) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid Filter. Please Adjust Your Values!</p>;
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No Events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(props.date.numYear, props.date.numMonth - 1);

  return (
    <Fragment>
      <ResultTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

export default FilteredEventsPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const filteredData = params.slug;
  const filteredYear = filteredData[0];
  const filteredMonth = filteredData[1];
  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (!filteredData) {
    return <p className="center">Loading...</p>;
  }

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return {
      // option 1
      props: {
        hasError: true,
      },
      // option 2
      // notFound:true
      // option 3
      // redirect:{ destination:'/error' }
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
}
