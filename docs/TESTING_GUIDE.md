# Testing Guide - Pass Management System

## Quick Start Testing

### 1. Test Category Tabs
1. Navigate to `/passes`
2. Verify you see 9 category tabs:
   - All Passes
   - Concerts
   - Workplace
   - Events
   - Retail
   - Access
   - **Community** (new)
   - **Temples** (new)
   - **Spiritual** (new)
3. Click each tab to verify filtering works

### 2. Test Location-Based Filtering
1. On `/passes`, allow location access when prompted
2. Verify you see: "Showing passes within 20km of your location"
3. Passes should be filtered based on your location
4. Passes without location data should still appear

### 3. Test Join Workflow (As User)

#### Step 1: Browse Passes
1. Go to `/passes`
2. Select a category (e.g., Community, Temples, or Spiritual)
3. Click on a pass to view details

#### Step 2: Request to Join
1. On pass detail page, you should see "Join This Pass" section
2. Click "Request to Join" button
3. Verify button shows "Joining..." during request
4. After success, page should show "Pending Approval" status

#### Step 3: Check Pending Status
1. Refresh the page
2. Verify you see:
   - Amber clock icon
   - "Pending Approval" heading
   - "Waiting for admin approval" message
3. Wallet buttons should NOT be visible

#### Step 4: Admin Approval (Next Phase)
Currently using SuperAdmin for approvals. In next phase, we'll add admin dashboard.

#### Step 5: After Approval
1. Once admin approves, refresh the page
2. Verify you see:
   - Green checkmark icon
   - "Approved!" heading
   - "Add to your wallet" message
3. Wallet buttons should now be visible:
   - "Add to Apple Wallet" (iOS/Desktop)
   - "Add to Google Pay" (Android/Desktop)

### 4. Test Membership Status Badges
1. Go to `/passes`
2. Find passes you've joined
3. Verify badges appear on pass cards:
   - **Pending**: Amber badge with "Pending Approval"
   - **Approved**: Green badge with "Approved"
   - **Rejected**: Red badge with "Rejected"

### 5. Test as Corporate Employee
1. Login as employee user
2. Verify you see both tabs:
   - Corporate Passes
   - Public Events
3. Corporate passes should show company-specific passes
4. Can still join Community, Temples, Spiritual passes

### 6. Test Search Functionality
1. On `/passes`, use search bar
2. Search by pass name
3. Search by location name
4. Verify results filter correctly

## API Testing (Using Postman/cURL)

### Get Passes with Filters
```bash
# Get all passes
curl http://localhost:3000/api/passes

# Get community passes
curl http://localhost:3000/api/passes?category=community

# Get passes near location (20km radius)
curl "http://localhost:3000/api/passes?lat=25.2048&lng=55.2708&radius=20"

# Get temples passes near location
curl "http://localhost:3000/api/passes?category=temples&lat=25.2048&lng=55.2708"
```

### Join a Pass (Requires Authentication)
```bash
# Request to join
curl -X POST http://localhost:3000/api/passes/[PASS_ID]/join \
  -H "Cookie: [YOUR_SESSION_COOKIE]"

# Check membership status
curl http://localhost:3000/api/passes/[PASS_ID]/join \
  -H "Cookie: [YOUR_SESSION_COOKIE]"
```

### Admin: Get Membership Requests
```bash
curl http://localhost:3000/api/admin/passes/memberships/approve \
  -H "Cookie: [ADMIN_SESSION_COOKIE]"
```

### Admin: Approve/Reject Request
```bash
# Approve
curl -X POST http://localhost:3000/api/admin/passes/memberships/approve \
  -H "Cookie: [ADMIN_SESSION_COOKIE]" \
  -H "Content-Type: application/json" \
  -d '{"membershipId": "[MEMBERSHIP_ID]", "action": "approve"}'

# Reject
curl -X POST http://localhost:3000/api/admin/passes/memberships/approve \
  -H "Cookie: [ADMIN_SESSION_COOKIE]" \
  -H "Content-Type: application/json" \
  -d '{"membershipId": "[MEMBERSHIP_ID]", "action": "reject"}'
```

## Database Verification

### Check Collections
```javascript
// Connect to MongoDB
use smartwave

// Check admin_passes with categories
db.admin_passes.find({ category: { $exists: true } })

// Check user_pass_memberships
db.user_pass_memberships.find()

// Check pending requests
db.user_pass_memberships.find({ status: "pending" })

// Check approved memberships
db.user_pass_memberships.find({ status: "approved" })
```

## Expected Behavior

### User Journey
1. ✅ User browses passes by category
2. ✅ Location-based filtering shows nearby passes
3. ✅ User clicks on a pass to view details
4. ✅ User requests to join the pass
5. ✅ Status changes to "Pending"
6. ✅ Admin approves the request
7. ✅ User can now add pass to wallet
8. ✅ Pass appears with "Approved" badge in list

### Admin Journey (Next Phase)
1. Admin logs in to admin dashboard
2. Views pending membership requests
3. Reviews user details and pass information
4. Approves or rejects requests
5. Users are notified of status change

## Common Issues & Solutions

### Issue: Location not detected
**Solution**: Ensure browser has location permissions enabled

### Issue: "Request to Join" button not showing
**Solution**: 
- Check if user is logged in
- Verify pass status is "active"
- Check if user already has a membership

### Issue: Wallet buttons not showing
**Solution**:
- Verify membership status is "approved"
- Check membership in database

### Issue: Passes not filtering by category
**Solution**:
- Check pass has category field in database
- Verify API is receiving category parameter

### Issue: Location filtering not working
**Solution**:
- Ensure passes have lat/lng coordinates
- Verify Haversine calculation is correct
- Check 20km radius parameter

## Next Steps After Testing

1. **Create Admin Dashboard**
   - Page to view all pending requests
   - Approve/reject functionality
   - User details display

2. **Add Notifications**
   - Email on approval/rejection
   - In-app notifications
   - Push notifications

3. **Enhance UI**
   - Loading states
   - Error messages
   - Success toasts

4. **Add Analytics**
   - Track join requests
   - Popular passes
   - Location-based insights

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify database connections
3. Check API responses in Network tab
4. Review server logs for backend errors

## Test Data Setup

### Create Test Passes
Use admin panel to create passes with:
- Different categories (community, temples, spiritual)
- Various locations with coordinates
- Mix of event and access types
- Some with and without location data

### Create Test Users
- Retail user (regular user)
- Corporate user (employee)
- Admin user
- SuperAdmin user

This will help test all user flows and permissions.
