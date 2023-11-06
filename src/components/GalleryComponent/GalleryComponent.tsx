"use client"
import React, { useRef, useState } from 'react';
import { data } from '@/data';
import Image from 'next/image';
import { FaRegImage } from 'react-icons/fa';

export default function GalleryComponent() {
  const [galleryImgs, setGalleryImgs] = useState(data);
  const [isHover, setIsHover] = useState(-1);
  const [checked, setChecked] = useState([]);
  const [isDragging, setIsDragging] = useState();
  const containeRef = useRef();
// @ts-ignore
  function handleChange(e) {
    let isChecked = e.target.checked;
    let value = parseInt(e.target.value);
    if (isChecked) {
        // @ts-ignore
      setChecked([...checked, value]);
    } else {
      setChecked(checked.filter((id) => id !== value));
    }
    if (value === 0) {
      setChecked([]);
    }
  }

  function deleteImage() {
    let finalImages = galleryImgs.filter((v) => {
        // @ts-ignore
      return !checked.includes(v.id);
    });
    setGalleryImgs(finalImages);
    setChecked([]);
  }
// @ts-ignore
  function detectLeftButton(e) {
    e = e || window.event;
    if ('buttons' in e) {
      return e.buttons === 1;
    }
    let button = e.which || e.button;
    return button === 1;
  }
// @ts-ignore
  function checkPosition(e) {
    // Implement this function if needed.
  }
// @ts-ignore
  function dragStart(e, index) {
    if (!detectLeftButton(e)) return;

    setIsDragging(index);

    const container = containeRef.current;
    // @ts-ignore
    const items = [...container.childNodes];
    const dragItem = items[index];
    let dragItemImage = dragItem.childNodes[1];
    const firstItem = items[0];
    const secondItem = items[1];
    const dragData = galleryImgs[index];
    let newData = [...galleryImgs];

    const dragItemBoundigRect = dragItem.getBoundingClientRect();
    const firstItemBoundigRect = firstItem.getBoundingClientRect();
    const secondItemBoundigRect = secondItem.getBoundingClientRect();

    dragItemImage.style.position = 'fixed';
    dragItemImage.style.zIndex = 6000;
    dragItemImage.style.width = dragItemBoundigRect.width + 'px';
    dragItemImage.style.height = dragItemBoundigRect.height + 'px';
    dragItemImage.style.top = dragItemBoundigRect.top + 'px';
    dragItemImage.style.left = dragItemBoundigRect.left + 'px';
    dragItemImage.style.cursor = 'grabbing';

    let x = e.clientX;
    let y = e.clientY;

    document.onpointermove = dragMove;
    

// @ts-ignore
    function dragMove(e) {
      const posX = e.clientX - x;
      const posY = e.clientY - y;

      dragItemImage.style.transform = `translate(${posX}px, ${posY}px)`;

      let targetId = e.target.id;
      if (targetId) {
        if (targetId > 0) {
          dragItemImage.style.width = secondItemBoundigRect.width + 'px';
          dragItemImage.style.height = secondItemBoundigRect.height + 'px';
        }
        if (targetId == 0) {
          dragItemImage.style.width = firstItemBoundigRect.width + 'px';
          dragItemImage.style.height = firstItemBoundigRect.height + 'px';
        }

        index = Number((index = +targetId));
        newData = galleryImgs.filter((item) => item.id !== dragData.id);
        newData.splice(index, 0, dragData);
      }
    }

    document.onpointerup = dragEnd;

    function dragEnd() {
      document.onpointerup = null;
      setIsDragging(undefined);
      dragItemImage.style = '';
      document.onpointermove = null;

      setGalleryImgs(newData);
    }
  }
// @ts-ignore
  function handleCheckboxMouseDown(e) {
    // Prevent event propagation to the parent onMouseDown handler
    e.stopPropagation();
  }

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header py-3">
          {checked.length !== 0 ? (
            <div className="d-flex justify-content-between align-items-center mx-4">
              <div className="d-flex align-items-center">
                <input
                  className="checkBoxAll me-2"
                  id="checkbox_id"
                  value="0"
                  type="checkbox"
                  checked
                  onChange={handleChange}
                  onMouseDown={handleCheckboxMouseDown}
                />
                <label className="checkBoxAllLabel" htmlFor="checkbox_id">
                  {checked.length} {checked.length === 1 ? 'File Selected' : 'Files Selected'}
                </label>
              </div>
              {checked.length === 1 ? (
                <span className="deleteFileText" onClick={deleteImage}>
                  Delete File
                </span>
              ) : (
                <span className="deleteFileText" onClick={deleteImage}>
                  Delete Files
                </span>
              )}
            </div>
          ) : (
            <h5 className="mb-0">Gallery</h5>
          )}
        </div>
        <div className="card-body">
        {/* @ts-ignore */}
          <div className="customGrid" ref={containeRef}>
            {galleryImgs.map(({ id, imgUrl }, index) => (
              <div
                key={id}
                className={`customGridItem rounded ${isDragging === index ? 'dragging' : ''}`}
                onMouseDown={(e) => dragStart(e, index)}
                onMouseEnter={() => setIsHover(index)}
                onMouseLeave={() => setIsHover(-1)}
              >
                {/* @ts-ignore */}
                <div className="overlay" id={index}></div>
                <div className={`imageContainer ${isDragging === index ? 'dragging' : ''}`}>
                    
                  <Image
                    key={index}
                    // @ts-ignore
                    id={index}

                    src={imgUrl}
                    width={400}
                    height={400}
                    alt="dfgsg"
                    className="rounded"
                    priority={true}
                    style={{
                      pointerEvents: isDragging === index ? 'none' : 'auto',
                    }}
                  />
                </div>
                {/* @ts-ignore */}
                {isHover === index || checked.includes(id) ? (
                  <input
                    className="checkBoxImage"
                    id={`checkbox_id${index}`}
                    name="image"
                    value={id}
                    // @ts-ignore
                    checked={checked.includes(id)}
                    type="checkbox"
                    onChange={handleChange}
                    onMouseDown={handleCheckboxMouseDown}
                  />
                ) : (
                  ''
                )}
              </div>
            ))}
            <div className="addImageSection">
              <FaRegImage className="addImageIcon" />
              <p className="mt-3 mb-0 addImageText">Add Images</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

