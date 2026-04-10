# Pass Management System - Implementation Summary

## Overview
We've successfully implemented a comprehensive pass management system with three new categories (Community, Temples, and Spiritual), location-based filtering, and a join/approval workflow.

## Features Implemented

### 1. **New Pass Categories**
Added three new pass categories alongside existing ones:
- **Community** - For community events and gatherings
- **Temples** - For temple visits and religious events  
- **Spiritual** - For spiritual retreats and meditation sessions

Existing categories maintained:
- All Passes
- Concerts
- Workplace
- Events
- Retail
- Access

### 2. **Location-Based Filtering (20km Radius)**
- Automatic geolocation detection for users
- Passes filtered within 20km radius of user's location
- Users can search for passes in different locations
- Haversine formula used for accurate distance calculation
- Passes without location data are always shown

### 3. **Join/Approval Workflow**

#### User Flow:
1. **Browse Passes** - Users can browse all active passes by category and location
2. **Request to Join** - Click "Request to Join" button on pass detail page
3. **Pending Status** - Request shows as "Pending Approval" with amber badge
4. **Admin Approval** - Admin/SuperAdmin reviews and approves/rejects request
5. **Approved Access** - Once approved, user can add pass to wallet
6. **Wallet Integration** - Add to Apple Wallet or Google Pay

#### Status States:
- **No Membership** - Shows "Request to Join" button
- **Pending** - Shows pending status with waiting message
- **Approved** - Shows wallet buttons (Apple Wallet & Google Pay)
- **Rejected** - Shows rejection message with contact info

### 4. **Database Schema**

#### AdminPass (Updated)
```typescript
{
  _id: ObjectId
  createdByAdminId: ObjectId
  name: string
  description?: string
  type: "event" | "access"
  category?: "all" | "concerts" | "workplace" | "events" | "retail" | "access" | "community" | "temples" | "spiritual"
  location?: {
    lat?: number
    lng?: number
    name: string
  }
  dateStart?: Date
  dateEnd?: Date
  tags?: string[]
  status: "draft" | "active"
  createdAt: Date
  updatedAt: Date
}
```

#### UserPassMembership (New Collection)
```typescript
{
  _id: ObjectId
  userId: ObjectId  // Reference to users collection
  userEmail: string
  passId: ObjectId  // Reference to admin_passes collection
  status: "pending" | "approved" | "rejected"
  requestedAt: Date
  approvedAt?: Date
  approvedBy?: ObjectId  // Admin/SuperAdmin who approved
  rejectedAt?: Date
  rejectedBy?: ObjectId
  addedToWallet?: boolean
  walletAddedAt?: Date
}
```

### 5. **API Endpoints**

#### User Endpoints:
- `GET /api/passes` - List passes with filters (category, location, radius)
  - Query params: `category`, `lat`, `lng`, `radius` (default 20km)
  - Returns passes with membership status
  
- `POST /api/passes/[id]/join` - Request to join a pass
  - Creates membership request with "pending" status
  
- `GET /api/passes/[id]/join` - Get membership status for a pass
  - Returns current membership status

#### Admin Endpoints:
- `GET /api/admin/passes/memberships/approve` - List all membership requests
  - Returns requests for admin's passes with user details
  
- `POST /api/admin/passes/memberships/approve` - Approve/reject membership
  - Body: `{ membershipId: string, action: 'approve' | 'reject' }`

### 6. **UI Components**

#### Passes List Page (`/passes`)
- Category tabs with icons (including new Community, Temples, Spiritual)
- Location indicator showing 20km radius when enabled
- Membership status badges on pass cards:
  - Pending (amber)
  - Approved (green)
  - Rejected (red)
- Interactive category filtering
- Search functionality

#### Pass Detail Page (`/passes/[id]`)
- Dynamic action card based on membership status:
  - **Not Member**: "Request to Join" button
  - **Pending**: Status indicator with waiting message
  - **Rejected**: Rejection notice with contact info
  - **Approved**: Wallet buttons (Apple & Google)
- Location map integration
- Pass details and description

### 7. **Utility Functions**

#### Location Utils (`lib/location-utils.ts`)
- `calculateDistance()` - Haversine formula for distance calculation
- `filterPassesByLocation()` - Filter passes within radius

## User Roles & Permissions

### Retail Users
- Can browse all public passes
- Can join Community, Temples, and Spiritual passes
- Receive passes based on location (20km radius)
- Can search for passes in other locations

### Corporate Users (Employees)
- Can browse corporate passes from their company
- Can join Community, Temples, and Spiritual passes
- Same location-based filtering applies
- See both corporate and public passes

### Admins
- Create passes with category selection
- Approve/reject join requests
- Currently using SuperAdmin for approvals
- Can manage all passes for their organization

## Next Steps (Future Enhancements)

1. **Admin Dashboard**
   - Create dedicated admin page for managing membership requests
   - Bulk approval/rejection functionality
   - Analytics and reporting

2. **Notifications**
   - Email notifications for approval/rejection
   - Push notifications for status changes
   - Reminder notifications for upcoming events

3. **Advanced Filtering**
   - Date range filtering
   - Multiple category selection
   - Custom radius selection
   - Sort by distance, date, popularity

4. **User Profile**
   - View all joined passes
   - Pass history
   - Wallet management
   - Favorite passes

5. **Pass Sharing**
   - Share pass links with friends
   - Social media integration
   - QR code sharing

## Testing Checklist

- [ ] Create passes with different categories
- [ ] Test location-based filtering with different coordinates
- [ ] Test join workflow (request → pending → approved)
- [ ] Test join workflow (request → pending → rejected)
- [ ] Verify wallet integration works for approved members
- [ ] Test category filtering on passes page
- [ ] Verify membership status badges display correctly
- [ ] Test with both retail and corporate users
- [ ] Verify 20km radius calculation accuracy
- [ ] Test search functionality with location

## Database Indexes (Recommended)

```javascript
// admin_passes collection
db.admin_passes.createIndex({ status: 1, category: 1 })
db.admin_passes.createIndex({ "location.lat": 1, "location.lng": 1 })
db.admin_passes.createIndex({ createdByAdminId: 1 })

// user_pass_memberships collection
db.user_pass_memberships.createIndex({ userId: 1, passId: 1 }, { unique: true })
db.user_pass_memberships.createIndex({ passId: 1, status: 1 })
db.user_pass_memberships.createIndex({ status: 1 })
```

## Configuration

No additional environment variables required. The system uses existing:
- `MONGODB_DB` - Database name
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For map integration

## Files Modified/Created

### Created:
- `/lib/admin/pass.ts` - Updated with category types and UserPassMembership interface
- `/lib/location-utils.ts` - Location calculation utilities
- `/app/api/passes/[id]/join/route.ts` - Join endpoint
- `/app/api/admin/passes/memberships/approve/route.ts` - Approval endpoint

### Modified:
- `/lib/admin/db.ts` - Added getUserPassMembershipsCollection()
- `/app/api/admin/passes/route.ts` - Added category support
- `/app/api/passes/route.ts` - Added location filtering and membership status
- `/app/(with-header)/passes/page.tsx` - Added category tabs and location filtering
- `/app/(with-header)/passes/[id]/page.tsx` - Added join workflow UI

## Summary

The implementation provides a complete pass management system with:
✅ 3 new categories (Community, Temples, Spiritual)
✅ Location-based filtering (20km radius)
✅ Join/approval workflow
✅ Membership status tracking
✅ Wallet integration for approved members
✅ Beautiful, modern UI with status indicators
✅ Support for both retail and corporate users
✅ Admin approval system (currently using SuperAdmin)

All functionality is ready for testing and can be extended with the admin dashboard for managing approvals in the next phase.
