import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as spotActions from '../../store/spots'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useNavigate } from "react-router-dom"; 
import { useModal } from '../../context/Modal';
import DeleteModal from "./DeleteModal";

function CurrentSpots(){
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    let spots = useSelector(state => state.spots);
    const [showMenu, setShowMenu] = useState(false)
    const { closeModal } = useModal();
    const navigate = useNavigate()

    let images = document.querySelectorAll('.image span');

    const openDeleteModal = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    } 

    const deleteSpot = (e, spotId) => {
        e.stopPropagation()
        dispatch(spotActions.deleteSpot(spotId))
        closeModal()
    }

    window.onmousemove = function (e) {
        let x = (e.clientX + 20) + 'px',
            y = (e.clientY + 20) + 'px';
        for (let i = 0; i < images.length; i++) {
            images[i].style.top = y;
            images[i].style.left = x;
        }
    };

    const updateSpot = (e, spotId) => {
        e.stopPropagation() 
        navigate(`/spots/${spotId}/edit`)
    }

    useEffect(() => {
        if(sessionUser) dispatch(spotActions.getCurrentSpots())
    }, [])

    useEffect(() => {
        if(!sessionUser?.id) navigate('/')
    })

    spots = Object.values(spots)

    const closeMenu = () => setShowMenu(!showMenu);

    return(
        <div className="manage-spots-container">
        <div className="manage-spots-header">
             <h2>Manage Spots</h2>
             {!spots.length && <button className="theme-button" onClick={() => navigate("/spots/new")}>Create a New Spot</button>}
         </div>

           <div className="manage-spot-content">
            <div className="spots-body">
            {spots.map((spot) => (
                <div  key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)} className="spot">
                    <div id="box" className="image">
                        <img className="spot-image" src={spot.previewImage}></img>
                        <span>{spot.name}</span>
                    </div>
                    <div className="spot-header">
                        <div>{spot.city}, {spot.state}</div>
                        {spot.avgRating == 0 ?
                        <span><b>New</b></span>
                        :
                        <span className="no-wrap"><i className="fas fa-star stars" /><b>{Number(spot.avgRating).toFixed(1)}</b></span>
                        }
                    </div>
                    <span><b>${spot.price}</b> night</span>
                    <div className="manage-spot-buttons">
                        <button className="theme-button" onClick={(e) => updateSpot(e, spot.id)}>Update</button>
                        <button className="theme-button" onClick={(e) => openDeleteModal(e)}>
                        <OpenModalMenuItem
                            itemText="Delete"
                            onItemClick={closeMenu}
                            modalComponent={<DeleteModal header={"Confirm Delete"} body={"Are you sure you want to remove this spot from the listings?"} action={(e) => deleteSpot(e, spot.id)}/>}
                        />
                        </button>
                    </div>
                </div>
            ))}
            </div>
           </div>

        </div>
    )
}

export default CurrentSpots