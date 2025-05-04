import { useEffect, useState } from "react";

export default function Course(props) {
    const { currentPage, course, enrolled, favorites, handleObserveChecked } = props;
    const [isChecked, setIsChecked] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(favorites?.includes(course) ? true : false);
        setIsEnrolled(enrolled?.includes(course) ? true : false);
    }, [enrolled, favorites]);

    useEffect(() => {
        if (isEnrolled) setIsChecked(true)
    }, [isEnrolled]);

    const renderCourseDates = (dates) => {
        let dateString = '';
        const dateArray = [];

        // Each date array can contain multiple day arrays
        // we want to loop through each date array
        dates.map((date) => {
            // Then loop through each day array
            date.forEach((time) => {
                // grab the time and convert it to milliseconds
                // so we can convert it to a useable date format
                date = new Date(parseInt(time) * 1000);
            });

            // And push it to the array for better handling
            dateArray.push(date);
        });

        // temp arrays for better handling
        const weekdays = [];
        const months = [];
        const days = [];

        dateArray.map((date) => {
            const targetWeekday = date.toLocaleString('default', {weekday: 'long'});
            if(!weekdays.includes(targetWeekday)) {
                weekdays.push(targetWeekday);
            }

            const targetMonth = date.toLocaleString('default', {month: 'long'});
            if(!months.includes(targetMonth)) {
                months.push(targetMonth);
            }
            
            const targetDay = date.getDate();
            if(!days.includes(targetDay)) {
                days.push(targetDay);
            }
        });

        // Format the super duper date string for rendering
        dateString += `${weekdays.join(' & ')}, ${months.join(' - ')} ${days.join(' & ')}`

        return dateString
    }

    const renderTime = (dates) => {
        let timeString = '';
        const timeArray = [];

        dates.map((date) => {
            let start = '';
            let end = '';

            date.forEach((time, index) => {
                if (index === 0)  {
                    start = new Date(parseInt(time) * 1000).toLocaleString('default', {hour: 'numeric'}).toLowerCase();
                    timeArray.push(start)
                }
                else {
                    end = new Date(parseInt(time) * 1000).toLocaleString('default', {hour: 'numeric'}).toLowerCase();
                    timeArray.push(end)
                }
            })
        });

        // Grab hour from first item and last item in array
        timeString = `${timeArray[0]} - ${timeArray[timeArray.length - 1]}`
        return timeString;
    }

    const renderPricingDates = (val) => {
        const month = new Date(val * 1000).toLocaleString('default', {month: 'long'});
        const day = new Date(val * 1000).getDate();

        return `${month} ${day}`
    }

    return (
        <div className="course" key={course.id}>
            {currentPage === '/' && (
                <div className="course-input">
                    <input
                        id={course.id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={(event) => {
                            setIsChecked(event.target.checked ? true : false);
                            handleObserveChecked(event.target.checked, course);
                        }}
                    />
                    <span className="course-radio"></span>
                    <span className="course-radio-outline"></span>
                </div>
            )}
            <div className="course-wrap">
                <label className="course-label" htmlFor={course.id}>Virtual Course</label>
                <div className="course-body">
                    <div className="course-info">
                        <h2 className="course-title">{renderCourseDates(course.dates)}</h2>
                        <p className="course-time">{renderTime(course.dates)}</p>
                        <p className="course-timezone">{course.location.timezone.indexOf('New') && course.location.timezone.indexOf('York') && 'New York City Time'}</p>
                        <p className="course-cost">
                            <strong>${course.pricing.amount}</strong>
                            {course.pricing.valid_until && ` Until ${renderPricingDates(course.pricing.valid_until)}`}
                        </p>
                    </div>
                    <div className="course-img profile">
                        <img
                            src={course.instructors[0].portrait_image}
                            alt={`Portrait of ${course.instructors[0].first_name}`}
                        />
                        <p className="profile-label">Instructor:</p>
                        <p className="profile-name">{course.instructors[0].first_name}</p>
                    </div>
                </div>
            </div>

            {isFavorite && (
                <i className="course-favorite">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" fill="none"><path d="M0 2.25V22.8609C0 23.4891 0.510937 24 1.13906 24C1.37344 24 1.60312 23.9297 1.79531 23.7938L9 18.75L16.2047 23.7938C16.3969 23.9297 16.6266 24 16.8609 24C17.4891 24 18 23.4891 18 22.8609V2.25C18 1.00781 16.9922 0 15.75 0H2.25C1.00781 0 0 1.00781 0 2.25Z" /></svg>
                </i>
            )}
        </div>
    )
}
