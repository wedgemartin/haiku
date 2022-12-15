class Haiku
  include Mongoid::Document
  include Mongoid::Timestamps
  field :username, type: String
  field :line1, type: String
  field :line2, type: String
  field :line3, type: String
  field :font, type: String
  has_many :votes

  def as_json_for_api(request=nil)
    data = self.as_json
    data['upvotes'] = self.votes.where(direction: 'up').count
    data['downvotes'] = self.votes.where(direction: 'down').count
    if request
      myvote = Vote.where(haiku_id: self.id, source: "#{request.env['HTTP_X_FORWARDED_HOST']}-#{request.env['HTTP_USER_AGENT']}").last
      if myvote
        data['myvote'] = myvote
      end
    end
    data
  end
end
