import React, { useState } from 'react';
import { calculatePace, removeTz } from '../../lib';
import DeleteSnackbar from '../delete-snackbar';
import EditDeleteMenu from '../edit-delete-menu';
import Map from '../gmaps/map';
import NoGpxFound from '../gmaps/no-gpx-found';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function RunMainCard(props) {
  const { title, date, description, distance, distanceUnits, duration, closeModal, entryId, gpxData, deleteRun } = props;

  const [toggleMenuIsOpen, setToggleMenuIsOpen] = useState(false);
  const [snackbarIsOpen, setSnackBarIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event, entryId) => {
    event.preventDefault();
    if (event.target.id === 'edit') {
      navigate(`/runs/${entryId}`);
    }
    if (event.target.id === 'delete') {
      setSnackBarIsOpen(true);
      setToggleMenuIsOpen(false);
    }
  };

  const handleDelete = entryId => {
    deleteRun(entryId);
  };

  const splitDuration = duration.split(':');
  const pace = calculatePace(distance, distanceUnits, splitDuration[0], splitDuration[1], splitDuration[2]);
  const dtDateOnly = removeTz(date);
  const formattedDate = format(new Date(dtDateOnly), 'MMMM d, yyyy');
  return (
    <div onClick={event => { if (event.target.id === 'background') { closeModal(); } }} id="background" className="w-full overflow-y-scroll h-screen fixed flex justify-center items-center top-0 left-0 bg-gray-800 bg-opacity-30 z-10">
      <div onClick={event => { if (event.target.tagName !== 'I') { setToggleMenuIsOpen(false); } } } className="absolute tall:relative bg-white rounded-xl p-6 max-w-xl min-w-[260px] w-[85%] top-10 tall:top-0 ml-6 mr-6">
        <button onClick={closeModal} className="absolute -top-4 -right-5 w-10 h-10 rounded-full bg-red-600 text-white"><i className="fa-regular fa-xl fa-circle-xmark" /></button>
        {
            gpxData === undefined
              ? <NoGpxFound borderRounded="rounded-xl" height="h-56 xxs:h-64 xs:h-80" textSize="text-xl" width="w-full " />
              : <Map gpxPath={gpxData} />
          }
        {/* content */}
        <div className="pl-1 mt-4">
          {/* content-header */}
          <div className="mb-4">
            <div className="flex justify-between items-center relative mb-1">
              <h1 className="font-lora text-lg md:text-xl font-bold">{title}</h1>
              <i onClick={() => setToggleMenuIsOpen(!toggleMenuIsOpen) } className="fa-solid fa-lg fa-ellipsis-vertical hover:cursor-pointer block pl-2 pt-3 pb-3" />
              {
                toggleMenuIsOpen === true
                  ? <EditDeleteMenu id={entryId} handleClick={handleClick} />
                  : ''
              }
            </div>
            <div className="flex flex-col x2s:flex-row font-lora text-md md:text-lg">
              <div className="mb-1 flex">
                <p>{formattedDate}</p>
                <span className="hidden x2s:block pr-2 pl-2">|</span>
              </div>
              <div className="flex gap-2">
                <p className=''>{distance} {distanceUnits}</p>
                <span className="block">|</span>
                <p>{pace}</p>
              </div>
            </div>
          </div>
          {/* content-main */}
          <div className="font-roboto text-md max-w-lg mb-4">
            <p>{description}</p>
          </div>
        </div>
      </div>
      {
        snackbarIsOpen === true
          ? <DeleteSnackbar isOpen={snackbarIsOpen} toggle={() => setSnackBarIsOpen(!snackbarIsOpen)} id={entryId} handleDelete={handleDelete} bottom='bottom-8'/>
          : ''
      }
    </div>
  );
}
