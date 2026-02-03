# Quick Reference - Pass Management System

## 🎯 What We Built

### New Features
✅ **3 New Categories**: Community, Temples, Spiritual  
✅ **Location Filtering**: 20km radius auto-detection  
✅ **Join Workflow**: Request → Pending → Approved/Rejected  
✅ **Wallet Integration**: Apple Wallet & Google Pay (approved only)  
✅ **Admin Dashboard**: Review and approve/reject requests  

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `lib/admin/pass.ts` | Updated types (PassCategory, UserPassMembership) |
| `lib/admin/db.ts` | Added getUserPassMembershipsCollection() |
| `lib/location-utils.ts` | Haversine distance calculation |
| `app/api/passes/[id]/join/route.ts` | Join pass endpoint |
| `app/api/admin/passes/memberships/approve/route.ts` | Approval endpoint |
| `app/admin/passes/memberships/page.tsx` | Admin approval UI |

## 📝 Files Modified

| File | Changes |
|------|---------|
| `app/api/admin/passes/route.ts` | Added category field support |
| `app/api/passes/route.ts` | Location filtering, membership status |
| `app/(with-header)/passes/page.tsx` | Category tabs, location UI |
| `app/(with-header)/passes/[id]/page.tsx` | Join workflow UI |

---

## 🗄️ Database Collections

### admin_passes (Updated)
```javascript
{
  category: "community" | "temples" | "spiritual" | ... // NEW
  location: { lat: Number, lng: Number, name: String }
  // ... existing fields
}
```

### user_pass_memberships (New)
```javascript
{
  userId: ObjectId,
  passId: ObjectId,
  status: "pending" | "approved" | "rejected",
  requestedAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId
}
```

**Indexes to Create:**
```javascript
db.user_pass_memberships.createIndex({ userId: 1, passId: 1 }, { unique: true })
db.user_pass_memberships.createIndex({ passId: 1, status: 1 })
db.admin_passes.createIndex({ status: 1, category: 1 })
```

---

## 🔌 API Endpoints

### User APIs

#### Get Passes (with filters)
```bash
GET /api/passes?category=community&lat=25.2048&lng=55.2708&radius=20
```

**Response:**
```json
{
  "passes": [...],
  "corporate": [...],
  "isEmployee": false,
  "filters": {
    "category": "community",
    "location": { "lat": 25.2048, "lng": 55.2708, "radius": 20 }
  }
}
```

#### Join Pass
```bash
POST /api/passes/[passId]/join
```

**Response:**
```json
{
  "success": true,
  "membership": {
    "_id": "...",
    "status": "pending",
    "requestedAt": "2026-02-03T..."
  }
}
```

#### Get Membership Status
```bash
GET /api/passes/[passId]/join
```

### Admin APIs

#### Get Membership Requests
```bash
GET /api/admin/passes/memberships/approve
```

**Response:**
```json
{
  "memberships": [
    {
      "_id": "...",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "passName": "Community Gathering",
      "status": "pending",
      "requestedAt": "..."
    }
  ]
}
```

#### Approve/Reject Request
```bash
POST /api/admin/passes/memberships/approve
Content-Type: application/json

{
  "membershipId": "...",
  "action": "approve" // or "reject"
}
```

---

## 🎨 UI Components

### Category Tabs
```typescript
const categories = [
  { icon: Ticket, label: "All Passes", value: "all" },
  { icon: UsersRound, label: "Community", value: "community" },
  { icon: Church, label: "Temples", value: "temples" },
  { icon: Heart, label: "Spiritual", value: "spiritual" },
  // ... more
];
```

### Membership Status Badges
- **Pending**: Amber badge, clock icon
- **Approved**: Green badge, checkmark icon
- **Rejected**: Red badge, X icon

### Action Card States
1. **No Membership**: "Request to Join" button
2. **Pending**: Status indicator, waiting message
3. **Approved**: Wallet buttons (Apple & Google)
4. **Rejected**: Rejection notice

---

## 🧪 Testing Commands

### Create Test Pass (Admin)
```javascript
// Via admin panel or API
{
  "name": "Community Yoga Session",
  "description": "Weekly community yoga",
  "type": "event",
  "category": "community",
  "location": {
    "name": "Central Park",
    "lat": 25.2048,
    "lng": 55.2708
  },
  "dateStart": "2026-02-10T10:00:00Z",
  "status": "active"
}
```

### Test Location Filtering
```bash
# Get passes near Dubai
curl "http://localhost:3000/api/passes?lat=25.2048&lng=55.2708&radius=20"

# Get community passes near location
curl "http://localhost:3000/api/passes?category=community&lat=25.2048&lng=55.2708"
```

### Test Join Workflow
```bash
# 1. Join pass
curl -X POST http://localhost:3000/api/passes/[PASS_ID]/join \
  -H "Cookie: [SESSION_COOKIE]"

# 2. Check status
curl http://localhost:3000/api/passes/[PASS_ID]/join \
  -H "Cookie: [SESSION_COOKIE]"

# 3. Admin approves
curl -X POST http://localhost:3000/api/admin/passes/memberships/approve \
  -H "Cookie: [ADMIN_COOKIE]" \
  -H "Content-Type: application/json" \
  -d '{"membershipId":"[ID]","action":"approve"}'
```

---

## 🔍 Debugging

### Check Membership in DB
```javascript
db.user_pass_memberships.find({ userEmail: "user@example.com" })
```

### Check Pass Categories
```javascript
db.admin_passes.distinct("category")
```

### Find Pending Requests
```javascript
db.user_pass_memberships.find({ status: "pending" })
```

### Check Location Data
```javascript
db.admin_passes.find({ 
  "location.lat": { $exists: true },
  "location.lng": { $exists: true }
})
```

---

## 📊 Status Flow

```
No Membership → Request to Join → Pending → Approved → Add to Wallet
                                        ↓
                                    Rejected
```

---

## 🚀 Next Steps

### Phase 1: Current ✅
- [x] Category tabs (Community, Temples, Spiritual)
- [x] Location-based filtering (20km)
- [x] Join workflow
- [x] Membership status tracking
- [x] Admin approval page

### Phase 2: Immediate
- [ ] Email notifications on approval/rejection
- [ ] In-app notification system
- [ ] User dashboard for joined passes
- [ ] Admin analytics

### Phase 3: Future
- [ ] Advanced search filters
- [ ] Pass recommendations
- [ ] Social sharing
- [ ] QR code check-in
- [ ] Pass usage analytics

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Location not detected | Enable browser location permissions |
| Join button not showing | Check if logged in, pass is active |
| Wallet buttons not showing | Verify membership status is "approved" |
| Categories not filtering | Check pass has category field in DB |

---

## 📞 Support

**Documentation:**
- `PASS_MANAGEMENT_IMPLEMENTATION.md` - Full implementation details
- `TESTING_GUIDE.md` - Step-by-step testing
- `ARCHITECTURE.md` - System architecture & flows

**Admin Dashboard:**
- URL: `/admin/passes/memberships`
- Features: View, approve, reject requests
- Filters: Pending, Approved, Rejected, All

**User Pages:**
- Browse: `/passes`
- Details: `/passes/[id]`
- Categories: 9 total (including 3 new)

---

## 💡 Tips

1. **Always test with location data** - Create passes with lat/lng
2. **Use meaningful categories** - Helps users find relevant passes
3. **Monitor pending requests** - Check admin dashboard regularly
4. **Test on mobile** - Location features work best on mobile
5. **Create indexes** - Improves query performance

---

## 🎯 Key Metrics to Track

- Total passes by category
- Join request conversion rate
- Approval/rejection ratio
- Average approval time
- Passes added to wallet
- Location-based engagement

---

**Version:** 1.0  
**Last Updated:** 2026-02-03  
**Status:** Production Ready ✅
