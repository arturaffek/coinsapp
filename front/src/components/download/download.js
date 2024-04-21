import React from 'react'

const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  function Download(a) {
    const exportToJson = e => {
        e.preventDefault();
        downloadFile({
          data: JSON.stringify(a.coins),
          fileName: 'transactions.json',
          fileType: 'text/json',
        })
      }
    return (
        <div className='actionBtns'>
          <button className='cta' type='button' onClick={exportToJson}>
            Export to JSON
          </button>
        </div>
    )
  }
  export default Download