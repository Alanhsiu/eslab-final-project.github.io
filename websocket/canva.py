from vpython import *

class basketball():
    scene = canvas(title='3D Basketball Court', width=1200, height=600)
    heightadjust = -3
    court = box(pos=vector(0, heightadjust, 0), size=vector(15, 0.1, 14), color=color.white)
    z_boarder = -court.size.z/2
    
    boardheight = 3.5
    hoopheight = 3.05
    d_fromboard = 0.23
    boardposition = 1.2
    
    backboard = box(pos=vector(0, boardheight+heightadjust, z_boarder+boardposition), size=vector(1.8, 1.2, 0.1), color=color.white)
    hoop = ring(pos=vector(0, hoopheight+heightadjust, backboard.pos.z+d_fromboard), axis=vector(0, 0.01, 0), radius = 0.23, thickness=0.03, color=color.red)
    hoop.pos.z += hoop.radius
    
    # generate the connecting rod
    rod = cylinder(pos=vector(0, hoopheight+heightadjust, backboard.pos.z+backboard.size.z/2), axis = vector(0, 0, 0.18), radius = 0.03, color=color.red, opacity =1)
    
    # generate the pillar
    pillar = cylinder(pos=vector(0, heightadjust, backboard.pos.z), axis = vector(0, 3.3,0), radius = 0.2, color = color.cyan)
    pillar.pos.z -= pillar.radius +backboard.size.z/2
    
    # generate the paint area
    boardthickness = backboard.size.z/2
    paintlength = 5.8
    paintwidth = 4.57
    paintleft = box(pos = vector(paintwidth/2, heightadjust,z_boarder+paintlength/2+boardposition/2), size = vector(0.1, 0.1, paintlength+boardposition), color = color.red, opacity = 1)
    paintright = box(pos = vector(-paintwidth/2, heightadjust,z_boarder+paintlength/2+boardposition/2), size = vector(0.1, 0.1, paintlength+boardposition), color = color.red, opacity = 1)
    freethrowline = box(pos = vector(0, heightadjust,paintlength+z_boarder+boardposition), size = vector(paintwidth, 0.1, 0.1), color = color.red, opacity = 1)

  
    # define the distance between the ball and the hoop
    # dist_2_point = 4.57  # width
    # dist_3_point = 7.24 # length
    
    # generate the basketball
    shootheight = 1.9
    ball_radius = 0.12
    basketball = sphere(pos=vector(0, shootheight+heightadjust,  freethrowline.pos.z), radius=ball_radius, color=color.orange, make_trail=False, trail_color=color.white)
    
    def set_shoot_position(self, level): # level 0: 2-point shot, level 1: 3-point shot
        dist = self.paintwidth if level == 0 else self.paintlength
        self.basketball.pos = vector(0, self.shootheight+self.heightadjust, dist-self.ball_radius)
    
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
                self.basketball.pos = vector(0, self.shootheight+self.heightadjust, self.paintwidth-self.ball_radius)
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
            if(self.basketball.pos.z <= self.backboard.pos.z+self.boardthickness+self.basketball.radius) and (self.basketball.pos.z >= self.backboard.pos.z -self.boardthickness-self.basketball.radius) and (self.basketball.pos.y <= self.backboard.pos.y+self.backboard.size.y/2) and (self.basketball.pos.y >= self.backboard.pos.y - self.backboard.size.y/2) and self.basketball.velocity.z < 0:
                self.basketball.velocity.z *= -0.3
                self.basketball.velocity.y *= 0.3
            
            self.basketball.pos += self.basketball.velocity * dt
            
            
            
        