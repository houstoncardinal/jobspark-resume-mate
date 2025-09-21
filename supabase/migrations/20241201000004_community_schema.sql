-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(50) DEFAULT 'General',
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    is_pinned BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Reactions Table
CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Comment Reactions Table
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id, reaction_type)
);

-- Post Bookmarks Table
CREATE TABLE IF NOT EXISTS post_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- User Follows Table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Community Categories Table
CREATE TABLE IF NOT EXISTS community_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO community_categories (name, description, color, icon) VALUES
('Career Success', 'Success stories, promotions, and career milestones', '#10B981', 'trophy'),
('Work Life', 'Work-life balance, remote work, and workplace discussions', '#3B82F6', 'briefcase'),
('Industry News', 'Latest industry trends and news', '#8B5CF6', 'newspaper'),
('Job Search', 'Job hunting tips, interview experiences, and opportunities', '#F59E0B', 'search'),
('Professional Development', 'Learning, skills, and career growth', '#EF4444', 'book-open'),
('Networking', 'Professional networking and connections', '#06B6D4', 'users'),
('Mentorship', 'Mentoring and guidance discussions', '#84CC16', 'user-check'),
('General', 'General professional discussions', '#6B7280', 'message-circle')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON community_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON community_posts(is_pinned);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON comment_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_post_bookmarks_post_id ON post_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_post_bookmarks_user_id ON post_bookmarks(user_id);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON community_posts
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view their own posts" ON community_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view followers posts" ON community_posts
    FOR SELECT USING (
        visibility = 'followers' AND 
        EXISTS (
            SELECT 1 FROM user_follows 
            WHERE follower_id = auth.uid() AND following_id = user_id
        )
    );

CREATE POLICY "Users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON community_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON community_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON community_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Reactions policies
CREATE POLICY "Anyone can view reactions" ON post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can create reactions" ON post_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" ON post_reactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON post_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Comment reactions policies
CREATE POLICY "Anyone can view comment reactions" ON comment_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can create comment reactions" ON comment_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comment reactions" ON comment_reactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment reactions" ON comment_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON post_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks" ON post_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON post_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON user_follows
    FOR SELECT USING (true);

CREATE POLICY "Users can create follows" ON user_follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON user_follows
    FOR DELETE USING (auth.uid() = follower_id);

-- Create views for aggregated data
CREATE OR REPLACE VIEW post_stats AS
SELECT 
    p.id,
    p.user_id,
    p.content,
    p.images,
    p.tags,
    p.category,
    p.visibility,
    p.is_pinned,
    p.is_edited,
    p.created_at,
    p.updated_at,
    COALESCE(like_count.likes, 0) as likes,
    COALESCE(comment_count.comments, 0) as comments,
    COALESCE(bookmark_count.bookmarks, 0) as bookmarks
FROM community_posts p
LEFT JOIN (
    SELECT post_id, COUNT(*) as likes
    FROM post_reactions
    WHERE reaction_type = 'like'
    GROUP BY post_id
) like_count ON p.id = like_count.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) as comments
    FROM community_comments
    GROUP BY post_id
) comment_count ON p.id = comment_count.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) as bookmarks
    FROM post_bookmarks
    GROUP BY post_id
) bookmark_count ON p.id = bookmark_count.post_id;

-- Create view for user reactions
CREATE OR REPLACE VIEW user_post_reactions AS
SELECT 
    pr.post_id,
    pr.user_id,
    pr.reaction_type,
    pr.created_at
FROM post_reactions pr
WHERE pr.user_id = auth.uid();

-- Create view for user bookmarks
CREATE OR REPLACE VIEW user_post_bookmarks AS
SELECT 
    pb.post_id,
    pb.user_id,
    pb.created_at
FROM post_bookmarks pb
WHERE pb.user_id = auth.uid();
