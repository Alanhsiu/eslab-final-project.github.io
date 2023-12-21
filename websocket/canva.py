from vpython import *

class basketball():
    scene = canvas(title='3D Basketball Court', width=1200, height=600)
    player_height = 1.9
    heightadjust = -3
    court = box(pos=vector(0, heightadjust, 0), size=vector(15, 0.1, 14), color=color.white)
    center = -court.size.z/2
    backboard = box(pos=vector(0, 3.5+heightadjust, center +1.2), size=vector(1.8, 1.2, 0.1), color=color.white)
    hoop = ring(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.23), axis=vector(0, 0.01, 0), radius = 0.23, thickness=0.03, color=color.red)
    hoop.pos.z += hoop.radius
    
    # generate the paint area
    paint1 = box(pos = vector(4.9/2-0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
    paint2 = box(pos = vector(-4.9/2+0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
    paint3 = box(pos = vector(0, heightadjust,5.8/2-0.05+center+5.8/2), size = vector(4.9, 0.1, 0.1), color = color.red, opacity = 1)

    # generate the connecting rod
    rod = cylinder(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.05), axis = vector(0, 0, 0.18), radius = 0.03, color=color.red, opacity =1)
    pillar = cylinder(pos=vector(0, heightadjust, backboard.pos.z-0.2), axis = vector(0, 3.3,0), radius = 0.2, color = color.cyan)
    
    # define the distance between the ball and the hoop
    dist_2_point = 4.57 
    dist_3_point = 7.24
    
    # generate the basketball
    ball_radius = 0.12
    basketball = sphere(pos=vector(0, player_height+heightadjust, dist_2_point-ball_radius), radius=ball_radius, color=color.orange, make_trail=False, trail_color=color.white)
    
    def set_shoot_position(self, level): # level 0: 2-point shot, level 1: 3-point shot
        dist = self.dist_2_point if level == 0 else self.dist_3_point
        self.basketball.pos = vector(0, self.player_height+self.heightadjust, dist-self.ball_radius)
    
    def shoot(self, ax = 0, ay = 0, az = 0):
        # initial position of the ball
        self.basketball.velocity = vector(0, 7, -3)
        self.basketball.velocity += vector(ay*0.001, az*(-0.002), ax*(0.01))
        g = vector(0, -9.8, 0)

        dt = 0.001  # time interval
        maxtime = 3 # maximum time for shooting
        time = 0
        
        while True:
            
            time += dt
            if time > maxtime:
                time = 0
                self.basketball.pos = vector(0, self.player_height+self.heightadjust, self.dist_2_point-self.ball_radius)
                return False
            
            rate(800)  # 1000 frames per second
            
            # hoop.pos points to the basketball
            ptrHoopToBall = norm(vector(self.basketball.pos.x, 0, self.basketball.pos.z) - vector(self.hoop.pos.x, 0, self.hoop.pos.z))*self.hoop.radius
            ringOfhoop = self.hoop.pos + ptrHoopToBall
            ringtoball = self.basketball.pos - ringOfhoop
            N_bounce = norm(ringtoball)

            # start to check if the ball is bounced into the hoop
            if(mag(ringtoball) <= self.hoop.thickness + self.basketball.radius):
                self.basketball.velocity += N_bounce * 0.2
            
            # check if the ball pass through the hoop
            if(self.basketball.pos.y <= self.hoop.pos.y+0.1 and (self.basketball.pos.y >= self.hoop.pos.y-0.1) and mag(vector(self.basketball.pos.x, 0, self.basketball.pos.z)-vector(self.hoop.pos.x, 0, self.hoop.pos.z)) <= self.hoop.radius-self.basketball.radius-self.hoop.thickness) and (self.basketball.velocity.y <=0):
                # TODO: display "2-point shot" or "3-point shot" on the canvas
                time = 0
                return True
            
            self.basketball.velocity += g * dt
            
            # if the ball is bumped into the ground, bounce
            if self.basketball.pos.y < self.basketball.radius+self.heightadjust and self.basketball.velocity.y < 0:
                self.basketball.velocity.y *= -0.5

            
            # if the ball is bumped into the backboard, bounce
            if(self.basketball.pos.z <= self.backboard.pos.z+0.05+self.basketball.radius) and (self.basketball.pos.z >= self.backboard.pos.z - 0.05-self.basketball.radius) and (self.basketball.pos.y <= self.backboard.pos.y+self.backboard.size.y/2) and (self.basketball.pos.y >= self.backboard.pos.y - self.backboard.size.y/2) and self.basketball.velocity.z < 0:
                self.basketball.velocity.z *= -0.3
                self.basketball.velocity.y *= 0.3
            
            self.basketball.pos += self.basketball.velocity * dt
            
            
            
        