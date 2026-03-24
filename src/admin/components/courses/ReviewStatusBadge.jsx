import { Badge } from '../badge'
import { COURSE_REVIEW_STATUS, VIDEO_REVIEW_STATUS } from '../../utils/courseStatus'

export function ReviewStatusBadge({ status, type = 'course' }) {
  const map = type === 'video' ? VIDEO_REVIEW_STATUS : COURSE_REVIEW_STATUS
  const config = map[status] || map.draft || map.pending

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
