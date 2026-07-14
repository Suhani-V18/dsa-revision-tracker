import Streak from "../components/Streak";
import Revision from "../components/RevisionQueue";
import Explanation from "../components/Explanation";
import AttemptForm from "../components/AttemptForm";
import ReadinessScore from "../components/ReadinessScore";
import DailyTarget from "../components/DailyTarget";

function Dashboard({ refreshKey, onAttemptLogged }) {
  return (
    <>
      <DailyTarget refreshKey={refreshKey} />
      <ReadinessScore refreshKey={refreshKey} />
      <Streak refreshKey={refreshKey} />
      <Revision key={refreshKey} />
      <Explanation refreshKey={refreshKey} />
      <AttemptForm onAttemptLogged={onAttemptLogged} />
    </>
  );
}

export default Dashboard;
