import { useIosInstallPrompt } from '../hooks/useIosInstallPrompt';
import { useWebInstallPrompt } from '../hooks/useWebInstallPrompt';

export const InstallComponent = () => {
  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();

  console.log('iosInstallPrompt :>> ', iosInstallPrompt);
  console.log('webInstallPrompt :>> ', webInstallPrompt);

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }
  return (
    <section className="flex flex-col items-center justify-center h-full">
      <h1>Install App</h1>
      <div className="flex flex-col items-center justify-center">
        <img
          className="mx-auto"
          style={{
            borderTopRightRadius: '50%',
            borderTopLeftRadius: '50%',
            backgroundColor: '#fff',
            marginTop: '-50px'
          }}
          width="100px"
          src="content/images/appIcon-transparent.png"
          alt="Icon"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <h3>Install App</h3>
          </div>
          {iosInstallPrompt && (
            <>
              <div className="text-center">
                Tap
                <img
                  src="content/images/Navigation_Action_2x.png"
                  style={{ margin: 'auto 8px 8px' }}
                  className=""
                  alt="Add to homescreen"
                  width="20"
                />
                then &quot;Add to Home Screen&quot;
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={handleIOSInstallDeclined}>Close</button>
              </div>
            </>
          )}
          {webInstallPrompt && (
            <div className="d-flex justify-content-around">
              <button className="btn btn-primary" onClick={handleWebInstallAccepted}>
                Install
              </button>
              <button className="btn btn-primary" onClick={handleWebInstallDeclined}>Close</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};